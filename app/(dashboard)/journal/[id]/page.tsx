
type EntryPageProps = {
    params: {
      id: string;
    };
  };

export default function EntryPage({ params }: EntryPageProps) {

    return (
        <div>Hello {params.id}</div>
      )
  }
  