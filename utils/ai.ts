import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from 'langchain/prompts'
import { Document } from 'langchain/document'
import { loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z.string().describe('quick summary of the entire entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
  })
)

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({
    entry: content,
  })

  return input
}

export const analyze = async (content) => {
  const input = await getPrompt(content)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const result = await model.call(input)

  try {
    return parser.parse(result)
  } catch (e) {
    console.log(e)
  }
}

export const qa = async (question, entries) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    })
  })

const questionPromptTemplateString = `Context information is below.
  ---------------------
  {context}
  ---------------------
  Given the context information and no prior knowledge, answer the question: {question}`;
  
  const questionPrompt = new PromptTemplate({
    inputVariables: ["context", "question"],
    template: questionPromptTemplateString,
  });
  
  const refinePromptTemplateString = `You are an AI assistant in a journaling app and help Users to get the answers based on their past journal entries.
  The original question is as follows: {question}
  We have provided an existing answer: {existing_answer}
  We have the opportunity to refine the existing answer
  (only if needed) with some more context below.
  ------------
  {context}
  ------------
  Given the new context, refine the original answer to better answer the question.
  You must provide a response, either original answer or refined answer. Make sure the final answer is human friendly tone. There shouldn't be any details about context`;
  
  const refinePrompt = new PromptTemplate({
    inputVariables: ["question", "existing_answer", "context"],
    template: refinePromptTemplateString,
  });
  
  const model = new OpenAI({ temperature: 0.3, modelName: 'gpt-3.5-turbo' })
  const chain = loadQARefineChain(model, {questionPrompt, refinePrompt, verbose: false})
  const embeddings = new OpenAIEmbeddings()
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
  const relavantDocs = await store.similaritySearch(question)
  const res = await chain.call({
    prompt: refinePrompt.format,
    input_documents: relavantDocs,
    question,
  })

  return res.output_text
}