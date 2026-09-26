import BibleDetailFirebase from
  "../../../components/BibleDetailFirebase";


type BiblePageProps = {
  params:
    Promise<{
      slug: string;
    }>;
};


/*
 * =====================================
 * PAGE
 * =====================================
 */

export default async function BibleDetailPage({
  params,
}: BiblePageProps) {

  const {
    slug,
  } =
    await params;


  return (
    <BibleDetailFirebase
      slug={
        slug
      }
    />
  );
}