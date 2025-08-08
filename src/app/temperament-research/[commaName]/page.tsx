type Props = {
  params: Promise<{ commaName: string }>;
};

export default async function CommaDetail({ params }: Props) {
    const { commaName } = await params;

    return <p>{commaName}</p>
}

