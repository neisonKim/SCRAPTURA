import SearchArchive from "../../components/SearchArchive";
import { getLocalArchiveRecords } from "../../data/archive";

export default function SearchPage() {
  return <SearchArchive initialRecords={getLocalArchiveRecords()} />;
}
