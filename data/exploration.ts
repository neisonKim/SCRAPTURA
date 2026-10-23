import type { CharacterStage, ContentNode, ContentType, Relation } from "./content-types";
import { visualCollections, type VisualCollection } from "./exploration-collections";

type LinkTarget = [ContentType, string, string];
type StageInput = [string, string, string];
export type TimelinePeriod = ContentNode & {
  type: "period";
  order: number;
  testament: "old" | "new";
  readingLabel: string;
};
export type VisualEntry = ContentNode & {
  type: "visual";
  order: number;
  collection: VisualCollection;
  observations: { title: string; description: string }[];
};

function relations(items: LinkTarget[]): Relation[] {
  return items.map(([targetType, targetSlug, label]) => ({
    targetType, targetSlug, label,
    relationType: `RELATED_${targetType.toUpperCase()}` as Relation["relationType"],
  }));
}
function stages(items: StageInput[]): CharacterStage[] {
  return items.map(([title, scripture, description], index) => ({ number: String(index + 1).padStart(2, "0"), title, scripture, description }));
}
type PeriodInput = {
  slug: string; titleKo: string; titleEn: string; book: string; image?: string; readingLabel: string;
  summary: string; overview: string; context: string; stages: StageInput[]; links: LinkTarget[];
};
const periodInputs: PeriodInput[] = [
  {
    slug: "creation-and-beginnings", titleKo: "창조와 인류의 시작", titleEn: "Creation & Beginnings", book: "genesis", readingLabel: "창세기 1–11장",
    summary: "창조의 선함에서 에덴의 상실, 홍수와 바벨까지. 성경은 인간의 시작과 관계의 깨어짐을 함께 이야기합니다.",
    overview: "창세기 첫 열한 장은 땅과 생명의 시작, 인간에게 맡겨진 책임, 죄와 폭력의 확산을 다룹니다. 에덴에서 바벨로 시야가 넓어지는 동안 심판과 보존의 약속이 교차합니다. 이어질 아브라함의 이야기는 이 온 세상의 문제를 배경으로 시작됩니다.",
    context: "이 구간은 창세기의 원역사에 해당합니다. 특정 기원전 연도로 환산하기보다 창조, 타락, 홍수, 민족들의 흩어짐이라는 본문의 순서를 따라 읽습니다.",
    stages: [
      ["좋은 세계와 인간의 책임", "Genesis 1–2", "생명이 질서 있게 채워지고 사람은 하나님의 형상으로 지음 받습니다. 동산을 돌보고 이웃과 관계를 맺는 책임이 주어집니다."],
      ["에덴 밖으로 이어지는 갈등", "Genesis 3–5", "불순종 이후 두려움과 책임 전가가 나타나고 가인과 아벨의 이야기에서 폭력이 형제의 관계를 무너뜨립니다."],
      ["홍수 이후의 언약", "Genesis 6–9", "노아의 가족과 생명이 방주 안에서 보존됩니다. 홍수 뒤의 언약은 심판의 기억과 생명을 향한 약속을 함께 전합니다."],
      ["바벨과 흩어진 민족들", "Genesis 10–11", "민족들의 계보와 바벨 이야기는 인류의 다양성과 교만을 보여 주며 아브람 가족의 등장으로 이어집니다."],
    ],
    links: [["book", "genesis", "창세기"], ["story", "creation", "창조 이야기"], ["story", "noah-and-the-flood", "노아와 홍수"], ["story", "tower-of-babel", "바벨탑"], ["person", "noah", "노아"]],
  },
  {
    slug: "patriarchs-and-promise", titleKo: "족장과 언약의 여정", titleEn: "Patriarchs & Promise", book: "genesis", image: "timeline-patriarchs-v2", readingLabel: "창세기 12–50장",
    summary: "아브라함의 부르심에서 요셉의 이집트 정착까지, 한 가족에게 주어진 약속이 세대를 건너 이어집니다.",
    overview: "땅과 자손, 모든 민족을 향한 복의 약속이 아브라함에게 주어집니다. 이삭과 야곱의 가정에는 경쟁과 갈등이 있고, 요셉은 형제에게 버림받아 이집트로 갑니다. 그러나 기근 속에서 가족이 다시 만나며 창세기의 끝은 출애굽을 기다리는 자리로 향합니다.",
    context: "족장 이야기는 이동하는 가족의 삶과 언약을 중심으로 전개됩니다. 정확한 연대와 이동 경로를 확정하기보다 창세기에 명시된 장소와 세대의 연결을 살펴봅니다.",
    stages: [
      ["떠나라는 부르심과 약속", "Genesis 12–17", "아브라함은 고향을 떠나 가나안으로 향합니다. 약속의 성취가 더딘 시간에도 하나님과의 언약이 이야기의 중심을 이룹니다."],
      ["이삭과 이어지는 세대", "Genesis 18–26", "이삭의 출생과 아브라함의 시험, 리브가와 이삭의 만남을 통해 다음 세대에 약속이 이어집니다."],
      ["야곱의 도피와 돌아옴", "Genesis 27–36", "형제 사이의 갈등으로 떠난 야곱은 벧엘과 얍복의 경험을 지나 에서와 다시 만납니다. 이스라엘의 가족이 형성됩니다."],
      ["요셉과 가족의 보존", "Genesis 37–50", "이집트로 팔려 간 요셉이 기근에 대비하고 형제들과 화해합니다. 가족은 이집트에 정착하지만 약속의 땅을 향한 소망을 남깁니다."],
    ],
    links: [["book", "genesis", "창세기"], ["person", "abraham", "아브라함"], ["person", "isaac", "이삭"], ["person", "jacob", "야곱"], ["person", "joseph", "요셉"], ["place", "egypt", "이집트"]],
  },
  {
    slug: "exodus-and-wilderness", titleKo: "출애굽과 광야", titleEn: "Exodus & Wilderness", book: "numbers", readingLabel: "출애굽기–신명기",
    summary: "종살이에서 해방된 백성이 시내산에서 언약을 맺고 광야에서 공동체의 삶을 배워 갑니다.",
    overview: "출애굽은 이집트에서 떠나는 사건에 머물지 않습니다. 시내산의 언약과 성막, 거룩함과 이웃을 위한 규례는 구원받은 백성이 어떻게 살아야 하는지를 묻습니다. 광야의 실패와 돌봄을 거쳐 다음 세대가 요단 동쪽에서 약속의 땅을 바라봅니다.",
    context: "출애굽기, 레위기, 민수기, 신명기는 같은 여정의 서로 다른 장면을 보여 줍니다. 성막과 율법의 기록도 이동과 공동체 형성의 흐름 속에 놓고 읽습니다.",
    stages: [
      ["압제에서 해방으로", "Exodus 1–15", "모세가 부름을 받고 유월절과 바다를 건너는 사건이 이어집니다. 백성은 이집트의 압제에서 벗어납니다."],
      ["시내산의 언약과 성막", "Exodus 19–40", "언약의 말씀과 성막의 지침이 주어집니다. 금송아지 사건과 언약의 갱신은 임재 앞에서의 책임을 드러냅니다."],
      ["거룩함을 배우는 공동체", "Leviticus 1–27", "제사와 정결, 속죄일과 거룩한 삶의 규례는 예배와 일상이 분리되지 않음을 보여 줍니다."],
      ["광야에서 다음 세대로", "Numbers 13–14", "정탐 이후의 불신으로 광야의 시간이 길어집니다. 민수기 후반과 신명기는 다음 세대의 준비와 언약의 재확인으로 이어집니다."],
    ],
    links: [["book", "exodus", "출애굽기"], ["book", "leviticus", "레위기"], ["book", "numbers", "민수기"], ["book", "deuteronomy", "신명기"], ["person", "moses", "모세"], ["place", "sinai", "시내산"], ["story", "twelve-spies", "열두 정탐꾼"]],
  },
  {
    slug: "conquest-and-judges", titleKo: "가나안 정착과 사사들", titleEn: "Settlement & Judges", book: "joshua", readingLabel: "여호수아·사사기·룻기",
    summary: "요단을 건너 땅을 분배받은 이스라엘은 언약의 책임과 공동체의 위기 앞에 섭니다.",
    overview: "여호수아는 땅을 받는 일과 그 땅에서 언약을 지키는 책임을 함께 전합니다. 사사기에서는 압제와 부르짖음, 구원과 다시 반복되는 실패가 이어집니다. 룻기는 같은 시대의 한 가족을 통해 충실한 사랑과 새로운 미래를 보여 줍니다.",
    context: "사사기는 한 왕조의 연속적인 통치 목록이 아닙니다. 지역별 구원 이야기와 공동체의 붕괴를 함께 읽어야 하며, 룻의 이야기는 사사들이 다스리던 때를 배경으로 합니다.",
    stages: [
      ["요단을 건너는 백성", "Joshua 1–6", "여호수아의 인도 아래 백성이 요단을 건넙니다. 길갈의 기억과 여리고 사건이 새로운 출발을 형성합니다."],
      ["기업의 분배와 언약", "Joshua 13–24", "지파별 기업과 도피성의 규정이 이어지고 세겜에서 여호수아가 백성에게 섬김의 선택을 요청합니다."],
      ["구원과 실패가 반복되다", "Judges 2–16", "드보라, 기드온, 삼손 등의 이야기는 외부의 압제와 내부의 무너짐을 함께 드러냅니다."],
      ["혼란 속에서 이어지는 인애", "Ruth 1–4", "룻과 나오미, 보아스의 선택은 가족의 회복을 이루며 다윗의 계보로 연결됩니다."],
    ],
    links: [["book", "joshua", "여호수아"], ["book", "judges", "사사기"], ["book", "ruth", "룻기"], ["person", "joshua", "여호수아"], ["person", "deborah", "드보라"], ["story", "crossing-the-jordan", "요단강 도하"]],
  },
  {
    slug: "rise-of-david", titleKo: "사울과 다윗의 시대", titleEn: "Saul & the Rise of David", book: "2-samuel", image: "timeline-early-monarchy-v2", readingLabel: "사무엘상",
    summary: "왕을 요구한 이스라엘, 첫 왕 사울, 그리고 들에서 부름받은 다윗. 왕권과 신뢰의 문제가 교차합니다.",
    overview: "사무엘의 사역에서 왕정으로 넘어가며 이스라엘은 새로운 형태의 지도력을 경험합니다. 사울의 통치와 다윗의 등장은 단순한 영웅의 교체가 아닙니다. 순종, 두려움, 우정, 보복을 거절하는 선택이 왕의 자격을 묻습니다.",
    context: "사무엘상은 사울과 다윗의 이야기를 교차시킵니다. 다윗의 기름 부음과 실제 왕위 등극 사이에는 긴 도피의 시간이 있으며, 사울의 죽음 뒤에도 왕국의 통합은 점진적으로 이루어집니다.",
    stages: [
      ["사무엘과 왕정의 요청", "1 Samuel 1–12", "사무엘이 자라 이스라엘을 이끌고, 백성의 왕정 요구 속에서 사울이 왕으로 세워집니다."],
      ["사울의 실패와 다윗의 부름", "1 Samuel 13–17", "사울의 불순종이 드러나고 다윗이 기름 부음을 받습니다. 엘라 골짜기에서 골리앗과의 대결이 일어납니다."],
      ["우정과 도피의 세월", "1 Samuel 18–26", "요나단의 우정과 사울의 추격이 이어집니다. 다윗은 자신을 해치려는 왕에게 보복할 기회를 내려놓습니다."],
      ["길보아에서 끝나는 통치", "1 Samuel 27–31", "다윗의 시글락 생활과 위기가 이어지는 동안 사울과 요나단은 길보아 전투에서 죽음을 맞습니다."],
    ],
    links: [["book", "1-samuel", "사무엘상"], ["person", "saul", "사울"], ["person", "david", "다윗"], ["person", "samuel", "사무엘"], ["story", "david-and-goliath", "다윗과 골리앗"], ["place", "valley-of-elah", "엘라 골짜기"]],
  },
  {
    slug: "united-kingdom", titleKo: "다윗과 솔로몬의 왕국", titleEn: "David & Solomon", book: "2-samuel", readingLabel: "사무엘하·열왕기상 1–11장",
    summary: "예루살렘이 왕국의 중심이 되고 다윗의 언약과 솔로몬의 성전이 세워집니다. 번영 속의 균열도 자라납니다.",
    overview: "다윗은 헤브론에서 시작해 예루살렘을 통치의 중심으로 삼습니다. 언약궤와 왕조의 약속은 왕국의 새로운 방향을 보여 주지만, 왕의 죄와 가정의 폭력은 공동체를 상처 입힙니다. 솔로몬의 지혜와 성전, 부의 확장 뒤에는 분열의 원인이 남습니다.",
    context: "사무엘하와 열왕기상은 왕국의 성취와 한계를 함께 전합니다. 역대상·하의 성전과 예배에 대한 관점도 함께 비교하며 읽을 수 있습니다.",
    stages: [
      ["헤브론에서 예루살렘으로", "2 Samuel 1–6", "다윗이 유다와 온 이스라엘의 왕이 되고 예루살렘을 중심지로 삼습니다. 언약궤가 성읍으로 옮겨집니다."],
      ["왕조의 약속과 왕의 책임", "2 Samuel 7–12", "다윗에게 왕조의 약속이 주어집니다. 이후 밧세바와 우리아 사건에서 왕의 죄가 드러나고 나단이 이를 책망합니다."],
      ["가정의 상처와 왕국의 위기", "2 Samuel 13–24", "압살롬의 반란과 여러 갈등을 통해 왕국의 취약함이 드러납니다. 왕의 선택이 공동체 전체에 영향을 줍니다."],
      ["솔로몬의 지혜와 성전", "1 Kings 1–11", "솔로몬이 왕위를 이어 성전을 봉헌합니다. 그러나 후반부의 불순종과 무거운 통치는 다음 세대의 분열로 이어집니다."],
    ],
    links: [["book", "2-samuel", "사무엘하"], ["book", "1-kings", "열왕기상"], ["person", "david", "다윗"], ["person", "solomon", "솔로몬"], ["place", "jerusalem", "예루살렘"], ["story", "solomon-temple", "성전의 봉헌"]],
  },
  {
    slug: "divided-kingdom", titleKo: "분열 왕국과 예언자들", titleEn: "Divided Kingdom & Prophets", book: "amos", readingLabel: "열왕기상 12장–열왕기하 23장",
    summary: "북이스라엘과 남유다로 나뉜 왕국에 예언자들이 예배와 정의, 신뢰와 회개의 문제를 제기합니다.",
    overview: "솔로몬 이후 왕국은 나뉘고 각 왕조는 권력과 예배의 기반을 세웁니다. 엘리야와 엘리사, 아모스와 호세아, 이사야와 미가 등의 메시지는 궁정의 결정과 사람들의 일상을 향합니다. 북왕국의 멸망 이후에도 남유다에는 개혁과 실패가 교차합니다.",
    context: "열왕기는 북왕국과 남왕국의 이야기를 번갈아 전합니다. 예언서는 그 역사와 겹쳐 읽되 각 예언자의 사역 시기와 메시지가 모두 같다고 보지 않습니다.",
    stages: [
      ["갈라진 왕국과 두 중심지", "1 Kings 12–16", "르호보암과 여로보암의 시대에 왕국이 분열되고 북왕국의 왕조들이 바뀝니다."],
      ["엘리야와 엘리사의 증언", "1 Kings 17–22", "엘리야는 가뭄과 갈멜산, 나봇의 포도원 사건에서 왕과 백성에게 말씀을 전합니다. 그 사역은 열왕기하에서 엘리사로 이어집니다."],
      ["북왕국의 마지막", "2 Kings 13–17", "북왕국의 혼란이 깊어지고 사마리아가 함락됩니다. 열왕기는 이 일을 언약을 저버린 역사와 연결합니다."],
      ["남유다의 개혁과 한계", "2 Kings 18–23", "히스기야와 요시야의 개혁은 예배의 회복을 추구하지만, 오랫동안 쌓인 불의와 불신의 문제를 드러냅니다."],
    ],
    links: [["book", "1-kings", "열왕기상"], ["book", "2-kings", "열왕기하"], ["book", "amos", "아모스"], ["person", "elijah", "엘리야"], ["person", "elisha", "엘리사"], ["place", "samaria", "사마리아"]],
  },
  {
    slug: "exile-and-hope", titleKo: "포로와 회복의 소망", titleEn: "Exile & Hope", book: "lamentations", readingLabel: "열왕기하 24–25장·포로기의 기록",
    summary: "예루살렘의 무너짐과 바벨론의 낯선 땅. 탄식과 신실함, 새로운 마음의 약속이 포로의 현실을 비춥니다.",
    overview: "성읍과 성전을 잃은 공동체는 자신의 역사를 다시 묻습니다. 예레미야애가는 파괴의 고통을 말하고, 예레미야의 편지는 포로지의 일상을 향합니다. 에스겔의 환상과 다니엘의 이야기는 심판 속에서도 끝나지 않는 소망과 충실함을 보여 줍니다.",
    context: "포로는 한 번의 이동으로 단순화할 수 없는 과정입니다. 열왕기의 마지막 장들과 예언서, 애가와 다니엘을 통해 떠남과 남음, 제국 속의 삶을 함께 살펴봅니다.",
    stages: [
      ["무너지는 예루살렘", "2 Kings 24–25", "바벨론의 침공과 여러 차례의 강제 이주 끝에 예루살렘과 성전이 파괴됩니다."],
      ["슬픔을 숨기지 않는 기도", "Lamentations 1–5", "상실한 성읍의 목소리가 고통을 드러냅니다. 자비를 기억하는 고백도 탄식 가운데 놓여 있습니다."],
      ["포로지에서 살아가는 사람들", "Jeremiah 29", "예레미야는 집을 짓고 이웃 성읍의 평안을 구하라고 전합니다. 기다림은 현실의 삶과 분리되지 않습니다."],
      ["새 마음과 회복의 약속", "Ezekiel 36–37", "새 마음과 새 영, 마른 뼈가 살아나는 환상은 무너진 공동체의 회복을 향합니다."],
    ],
    links: [["book", "lamentations", "예레미야애가"], ["book", "ezekiel", "에스겔"], ["book", "daniel", "다니엘"], ["person", "jeremiah", "예레미야"], ["place", "babylon", "바벨론"], ["story", "dry-bones-and-new-heart", "새 마음과 마른 뼈"]],
  },
  {
    slug: "return-and-rebuilding", titleKo: "귀환과 공동체의 재건", titleEn: "Return & Rebuilding", book: "nehemiah", readingLabel: "에스라·느헤미야·학개·스가랴",
    summary: "예루살렘으로 돌아온 사람들은 성전과 성벽을 세우며 예배와 일상, 공동체의 책임을 다시 배웁니다.",
    overview: "고레스의 조서 이후 귀환의 길이 열립니다. 무너진 터에 성전을 세우고 성벽을 수리하는 과정에는 지연과 반대가 있습니다. 말씀을 듣는 일과 이웃을 돌보는 일은 건축만큼 중요한 재건의 과제가 됩니다.",
    context: "에스라와 느헤미야는 서로 다른 귀환과 재건의 단계를 전합니다. 학개와 스가랴는 성전 재건의 현장을 비추며, 귀환 뒤에도 제국 밖의 독립 왕국이 즉시 회복된 것은 아닙니다.",
    stages: [
      ["귀환의 길이 열리다", "Ezra 1–3", "귀환자들이 예루살렘에 모여 제단을 세우고 성전의 기초를 놓습니다. 기쁨과 눈물이 함께 나타납니다."],
      ["중단을 넘어 성전을 세우다", "Ezra 4–6", "반대와 중단의 시간을 지나 예언자들의 격려와 함께 성전이 완성되고 유월절을 지킵니다."],
      ["에스라와 말씀의 책임", "Ezra 7–10", "에스라는 말씀을 배우고 행하며 가르치는 사명을 갖고 돌아옵니다. 공동체는 자신의 삶을 돌아봅니다."],
      ["성벽 너머의 공동체", "Nehemiah 1–13", "느헤미야의 성벽 재건과 백성의 말씀 청취가 이어집니다. 빚과 착취, 안식일과 예배의 문제도 재건의 일부입니다."],
    ],
    links: [["book", "ezra", "에스라"], ["book", "nehemiah", "느헤미야"], ["book", "haggai", "학개"], ["person", "ezra", "에스라"], ["person", "nehemiah", "느헤미야"], ["story", "nehemiah-wall", "성벽의 재건"]],
  },
  {
    slug: "life-of-jesus", titleKo: "예수의 삶과 하나님 나라", titleEn: "Jesus & the Kingdom", book: "matthew", readingLabel: "복음서의 탄생·갈릴리 사역",
    summary: "갈릴리의 길과 마을에서 예수는 하나님 나라를 선포하고 제자를 부르며 소외된 이들을 만납니다.",
    overview: "네 복음서는 예수의 삶을 서로 다른 초점에서 증언합니다. 탄생과 세례, 시험과 제자의 부름을 지나 가르침과 치유, 식탁의 만남이 이어집니다. 예루살렘을 향한 여정은 하나님 나라의 권위와 섬김이 어떤 모습인지를 묻습니다.",
    context: "복음서는 같은 사건을 서로 다른 배열과 강조로 전하기도 합니다. 모든 장면을 하나의 확정된 일자표로 합치기보다 각 복음서의 흐름을 존중하며 나란히 읽습니다.",
    stages: [
      ["탄생과 기다림", "Luke 1–2", "사가랴와 엘리사벳, 마리아와 요셉, 목자와 성전의 기다림 속에서 예수의 탄생이 전해집니다."],
      ["세례와 새로운 시작", "Mark 1", "세례 요한의 사역과 예수의 세례, 시험, 하나님 나라의 선포와 첫 제자들의 부름이 이어집니다."],
      ["가르침과 치유, 새로운 삶", "Matthew 5–9", "산 위의 가르침과 다양한 치유의 장면은 하나님 나라의 의와 긍휼을 구체적으로 드러냅니다."],
      ["예루살렘을 향하는 길", "Luke 9–19", "예수는 이웃 사랑과 잃은 이를 찾는 기쁨을 가르치며 예루살렘을 향해 나아갑니다."],
    ],
    links: [["book", "matthew", "마태복음"], ["book", "mark", "마가복음"], ["book", "luke", "누가복음"], ["book", "john", "요한복음"], ["person", "jesus", "예수 그리스도"], ["place", "galilee", "갈릴리"], ["story", "sermon-on-the-mount", "산 위의 가르침"]],
  },
  {
    slug: "cross-and-resurrection", titleKo: "십자가와 부활", titleEn: "Cross & Resurrection", book: "john", image: "timeline-resurrection-v2", readingLabel: "복음서의 수난·부활 기록",
    summary: "마지막 식탁에서 십자가와 빈 무덤, 다시 만난 제자들에게 주어진 사명까지 복음의 중심을 따라갑니다.",
    overview: "예수는 제자들과 마지막 식탁을 나누고 체포와 재판, 십자가의 죽음으로 나아갑니다. 복음서는 이 죽음과 부활을 분리하지 않습니다. 부활의 만남은 두려움과 상실 속의 제자들을 새롭게 하며 모든 민족을 향한 증언으로 이어집니다.",
    context: "수난과 부활은 네 복음서 모두의 중요한 결말입니다. 각 증언의 세부 차이를 지우지 않으면서 예수의 자기 내어 줌, 부활의 소식과 제자들의 사명을 함께 읽습니다.",
    stages: [
      ["마지막 식탁과 섬김", "John 13–17", "발을 씻기시는 섬김과 사랑의 계명, 제자들을 위한 기도가 이어집니다."],
      ["체포와 십자가", "Mark 14–15", "겟세마네의 기도, 제자들의 흩어짐과 재판을 지나 예수는 십자가에서 죽으십니다."],
      ["빈 무덤과 부활의 만남", "John 20–21", "막달라 마리아와 제자들이 부활하신 예수를 만납니다. 도마의 고백과 베드로에게 주어진 돌봄의 사명이 이어집니다."],
      ["모든 민족을 향한 위임", "Matthew 28", "부활하신 예수는 제자들에게 모든 민족을 제자로 삼고 가르치라는 사명을 맡기십니다."],
    ],
    links: [["book", "john", "요한복음"], ["book", "matthew", "마태복음"], ["person", "jesus", "예수 그리스도"], ["person", "mary-magdalene", "막달라 마리아"], ["story", "emmaus-and-resurrection", "엠마오의 만남"], ["story", "matthew-cross-and-commission", "부활과 위임"]],
  },
  {
    slug: "birth-of-church", titleKo: "성령과 초대교회의 시작", titleEn: "Pentecost & the Early Church", book: "acts", readingLabel: "사도행전 1–12장",
    summary: "예루살렘에 모인 제자들이 성령을 받고 증인이 됩니다. 복음은 사마리아와 이방인의 집으로 경계를 넓힙니다.",
    overview: "오순절의 성령 강림 이후 말씀과 기도, 식탁과 나눔의 공동체가 형성됩니다. 성장은 갈등과 박해를 동반합니다. 스데반의 죽음과 흩어짐, 빌립과 베드로의 만남들은 증언이 예루살렘 밖으로 향하는 길을 보여 줍니다.",
    context: "사도행전은 교회의 성장을 성공담으로만 기록하지 않습니다. 나눔의 어려움과 차별, 공동체의 정직함과 경계의 문제도 성령의 인도하심 속에서 다룹니다.",
    stages: [
      ["기다림과 증인의 약속", "Acts 1", "제자들은 예루살렘에 머물러 기도하며 땅끝까지 증인이 되라는 부르심을 기다립니다."],
      ["오순절과 함께 나누는 삶", "Acts 2–4", "다양한 언어로 복음이 들리고 사람들이 공동체에 더해집니다. 가르침과 기도, 식탁과 필요를 돌보는 나눔이 이어집니다."],
      ["갈등과 박해 속의 증언", "Acts 5–8", "공동체는 정직함과 돌봄의 문제를 마주합니다. 스데반의 죽음 뒤 흩어진 사람들은 다른 곳에서도 복음을 전합니다."],
      ["닫힌 경계를 넘어", "Acts 9–12", "사울의 변화와 고넬료의 집에서의 만남을 통해 이방인도 복음 안으로 초대받는다는 사실이 확인됩니다."],
    ],
    links: [["book", "acts", "사도행전"], ["person", "peter", "베드로"], ["person", "stephen", "스데반"], ["person", "paul", "바울"], ["place", "jerusalem", "예루살렘"], ["story", "pentecost-and-witness", "오순절과 증인들"]],
  },
  {
    slug: "gospel-to-nations", titleKo: "열방으로 이어지는 복음", titleEn: "Gospel to the Nations", book: "romans", readingLabel: "사도행전 13–28장·사도들의 편지",
    summary: "안디옥에서 시작된 선교의 길은 소아시아와 마케도니아, 로마로 이어지고 편지들은 각 교회의 삶을 돌봅니다.",
    overview: "바울과 동역자들은 길을 떠나 새로운 공동체를 만나고 다시 방문합니다. 교회들은 문화와 신분, 식탁과 예배, 고난과 소망의 문제를 배웁니다. 사도행전은 로마에서의 증언으로 끝나지만, 편지들은 복음이 일상과 관계를 어떻게 바꾸는지 계속 들려줍니다.",
    context: "서신서는 사도행전 이후에 차례대로 작성된 문서 목록이 아닙니다. 일부는 선교 여행의 시기와 겹치며, 각각의 수신자와 문제를 살펴 읽어야 합니다.",
    stages: [
      ["안디옥에서 시작되는 파송", "Acts 13–15", "바울과 바나바가 파송되어 여러 도시에서 복음을 전합니다. 이방인 신자들의 자리를 두고 예루살렘에서 논의가 이루어집니다."],
      ["바다를 건너 세워지는 교회", "Acts 16–20", "빌립보와 데살로니가, 고린도와 에베소 등에서 공동체가 세워집니다. 만남과 갈등, 돌봄과 작별이 길 위에서 이어집니다."],
      ["재판과 항해 끝의 로마", "Acts 21–28", "체포와 여러 재판, 위험한 항해를 거친 바울은 로마에 도착합니다. 사도행전의 끝에서도 하나님 나라의 증언은 계속됩니다."],
      ["편지로 돌보는 공동체", "Romans 12–16", "서로 다른 지체의 섬김과 환대, 약한 이웃의 유익, 여러 동역자의 이름이 복음의 구체적인 삶을 보여 줍니다."],
    ],
    links: [["book", "acts", "사도행전"], ["book", "romans", "로마서"], ["person", "paul", "바울"], ["person", "barnabas", "바나바"], ["place", "antioch", "안디옥"], ["place", "rome", "로마"], ["story", "gospel-to-the-nations", "선교의 확장"]],
  },
];

export const timelinePeriods: TimelinePeriod[] = periodInputs.map((item, index) => ({
  type: "period", slug: item.slug, titleKo: item.titleKo, titleEn: item.titleEn,
  order: index + 1, testament: index < 9 ? "old" : "new", readingLabel: item.readingLabel,
  eyebrow: `TIMELINE · ${index < 9 ? "OLD TESTAMENT" : "NEW TESTAMENT"}`,
  summary: item.summary, overview: item.overview, biblicalContext: item.context,
  heroImage: item.image ? `/assets/editorial/${item.image}.webp` : `/assets/bible/${item.book}.webp`, periodStages: stages(item.stages),
  scripture: [...new Set(item.stages.map(stage => stage[1]))], relations: relations(item.links),
}));

type VisualInput = [string, string, string, string, VisualCollection, string, StageInput[], LinkTarget[]];
const visualInputs: VisualInput[] = [
  ["creation-at-dawn", "처음 빛이 비추는 세계", "Creation at Dawn", "genesis", "beginnings", "강과 동산, 빛과 생명이 어우러지는 창조의 장면을 따라 인간에게 맡겨진 돌봄을 생각합니다.",
    [["빛과 질서", "Genesis 1", "빛과 어둠, 물과 땅이 구별되고 생명이 채워지는 본문의 흐름을 떠올려 보세요."], ["물을 따라 자라는 생명", "Genesis 2:4–17", "강과 나무는 동산의 풍성함을 드러냅니다. 사람에게는 그곳을 경작하고 지킬 책임이 주어집니다."], ["함께 살아가는 존재", "Genesis 1:26–31", "인간의 자리는 다른 생명을 지우는 중심이 아니라 하나님의 형상에 합당한 책임의 자리입니다."]],
    [["story", "creation", "창조 이야기"], ["period", "creation-and-beginnings", "창조와 인류의 시작"]]],
  ["tabernacle-and-holiness", "광야의 성막과 제단", "Tabernacle & Holiness", "leviticus", "beginnings", "천막과 제단, 예배의 자리를 통해 광야 한가운데 세워진 거룩함의 질서를 살펴봅니다.",
    [["함께 거하시는 자리", "Exodus 40", "성막은 이동하는 백성 가운데 놓입니다. 그 중심은 웅장한 건축보다 하나님과 백성의 관계입니다."], ["예배의 질서", "Leviticus 1–7", "제단과 제사장의 모습에서 다양한 제사의 목적과 예배자의 책임을 살펴보세요."], ["일상으로 이어지는 거룩함", "Leviticus 19", "성막 밖의 일상에서도 이웃 사랑과 정직한 거래, 약자를 향한 책임이 요청됩니다."]],
    [["person", "aaron", "아론"], ["story", "day-of-atonement", "속죄일"], ["period", "exodus-and-wilderness", "출애굽과 광야"]]],
  ["camp-in-the-wilderness", "광야의 진영과 구름", "Camp in the Wilderness", "numbers", "beginnings", "성막을 중심으로 펼쳐진 진영과 광야의 길에서 이동하는 공동체의 질서와 기다림을 봅니다.",
    [["중심을 둘러싼 진영", "Numbers 2", "지파의 진영은 성막을 둘러싸고 배치됩니다. 멀리 펼쳐진 천막들을 하나의 공동체로 바라보세요."], ["멈춤과 출발", "Numbers 9:15–23", "구름이 머물 때 쉬고 떠오를 때 이동합니다. 광야의 시간에는 기다림도 포함됩니다."], ["길에서 드러나는 신뢰", "Numbers 13–14", "넓은 풍경의 장엄함과 별개로, 백성은 두려움과 불신 앞에서 중요한 선택을 마주합니다."]],
    [["story", "twelve-spies", "열두 정탐꾼"], ["person", "moses", "모세"], ["period", "exodus-and-wilderness", "출애굽과 광야"]]],
  ["moses-before-the-land", "약속의 땅을 바라보다", "Looking toward the Land", "deuteronomy", "beginnings", "요단 건너편을 바라보는 모세의 뒷모습을 통해 기억과 다음 세대의 책임을 생각합니다.",
    [["건너편을 바라보는 시선", "Deuteronomy 34", "느보산에서 땅을 바라보는 모세의 마지막 시선은 자신의 여정과 다음 세대의 시작을 함께 품습니다."], ["기억을 전하는 말", "Deuteronomy 6", "가르침은 일상의 자리에서 자녀와 이웃에게 전해집니다. 약속의 땅에서도 기억은 계속 필요합니다."], ["생명을 택하라는 요청", "Deuteronomy 30", "땅에 들어가는 것만으로 이야기가 완성되지 않습니다. 사랑과 순종의 삶이 요청됩니다."]],
    [["person", "moses", "모세"], ["place", "mount-nebo", "느보산"], ["story", "choose-life", "생명을 택하라"]]],
  ["jordan-crossing", "요단강에 열린 길", "A Path through the Jordan", "joshua", "beginnings", "강과 마른 땅, 언약궤를 메고 걷는 제사장들의 장면에서 건넘과 기억의 의미를 읽습니다.",
    [["먼저 들어서는 발걸음", "Joshua 3", "언약궤를 멘 제사장들이 물가에 들어섭니다. 백성의 행렬과 언약궤의 위치에 주목해 보세요."], ["다음 세대를 위한 돌", "Joshua 4", "기념 돌은 다음 세대가 이 사건을 질문하게 합니다. 건너는 경험은 기억을 전하는 책임으로 이어집니다."], ["새로운 땅의 책임", "Joshua 5", "길갈의 할례와 유월절은 군사적 출발 이전에 언약의 정체성을 다시 확인합니다."]],
    [["story", "crossing-the-jordan", "요단강 도하"], ["place", "jordan-river", "요단강"], ["person", "joshua", "여호수아"]]],
  ["ruth-in-the-fields", "룻이 이삭을 줍는 밭", "Ruth in the Barley Fields", "ruth", "beginnings", "추수 뒤에 남은 이삭과 낯선 땅의 이주민을 통해 생계를 지탱하는 인애와 환대를 바라봅니다.",
    [["남겨진 이삭", "Ruth 2", "룻에게 밭은 풍경이기 전에 하루의 양식을 구하는 자리입니다. 일하는 손과 떨어진 곡식에 주목하세요."], ["안전과 환대를 만드는 말", "Ruth 2:8–16", "보아스는 룻이 안전하게 일하고 물을 마실 수 있도록 배려합니다. 환대는 구체적인 행동으로 드러납니다."], ["가족의 미래로 이어지는 돌봄", "Ruth 4", "작은 돌봄의 선택들은 나오미의 회복과 새로운 가족, 다윗의 계보로 이어집니다."]],
    [["person", "ruth", "룻"], ["person", "boaz", "보아스"], ["story", "ruth-loyalty", "룻의 동행"]]],
  ["david-over-jerusalem", "예루살렘을 바라보는 왕", "A King above Jerusalem", "2-samuel", "kingdom", "높은 테라스에 선 왕과 성읍의 거리를 통해 다윗 왕국의 약속과 책임을 함께 봅니다.",
    [["새로운 중심지", "2 Samuel 5–6", "예루살렘은 왕의 거처이자 언약궤가 들어오는 성읍이 됩니다. 도시의 의미가 달라지는 전환을 읽으세요."], ["왕조를 향한 약속", "2 Samuel 7", "다윗의 집을 향한 약속은 왕이 스스로 만들어 내는 영광보다 하나님의 신실함에 초점을 둡니다."], ["높은 자리의 책임", "2 Samuel 11–12", "왕의 권력은 이웃의 생명과 무관하지 않습니다. 나단의 책망은 왕의 잘못을 가리지 않습니다."]],
    [["person", "david", "다윗"], ["place", "jerusalem", "예루살렘"], ["period", "united-kingdom", "다윗과 솔로몬의 왕국"]]],
  ["temple-of-solomon", "돌과 백향목의 성전", "Stone, Cedar & Temple", "1-kings", "kingdom", "돌과 나무, 놋 기둥과 넓은 뜰을 통해 성전 건축과 봉헌 기도의 의미를 살펴봅니다.",
    [["함께 지어지는 공간", "1 Kings 5–7", "자재와 장인, 긴 노동이 성전을 세웁니다. 완성된 모습 뒤에 있는 사람들의 손을 생각해 보세요."], ["봉헌의 기도", "1 Kings 8", "솔로몬은 성전을 봉헌하며 용서와 응답을 구합니다. 하나님을 건물 안에 가둘 수 없다는 고백도 포함됩니다."], ["건물과 삶의 관계", "1 Kings 9", "성전이 있다는 사실만으로 공동체의 미래가 보장되지는 않습니다. 언약을 따르는 삶이 요청됩니다."]],
    [["person", "solomon", "솔로몬"], ["story", "solomon-temple", "성전의 봉헌"], ["period", "united-kingdom", "통일 왕국"]]],
  ["esther-at-the-door", "왕궁 문 앞의 에스더", "Esther at the Threshold", "esther", "kingdom", "거대한 기둥과 그 앞에 선 한 사람의 대비에서 두려움 속의 결단과 공동체를 향한 책임을 읽습니다.",
    [["문턱 앞의 위험", "Esther 4–5", "부름 없이 왕에게 나아가는 선택에는 위험이 따릅니다. 넓은 홀과 한 사람의 크기를 비교해 보세요."], ["혼자만의 용기가 아닌 결단", "Esther 4:15–17", "에스더는 공동체에 함께 금식해 달라고 요청합니다. 왕궁의 선택은 바깥 사람들의 삶과 연결됩니다."], ["기억하고 나누는 기쁨", "Esther 9", "구원의 기억은 절기와 선물, 가난한 이들을 위한 나눔으로 전해집니다."]],
    [["person", "esther", "에스더"], ["place", "susa", "수산"], ["story", "esther-decision", "에스더의 결단"]]],
  ["ruins-and-lament", "무너진 성읍의 탄식", "Lament among the Ruins", "lamentations", "kingdom", "비어 있는 거리와 무너진 돌들 사이에서 상실을 말하는 기도와 회복을 기다리는 마음을 봅니다.",
    [["도시가 겪은 상실", "Lamentations 1", "도시가 한 사람처럼 슬퍼합니다. 빈 길과 허물어진 문은 공동체 전체의 상처를 환기합니다."], ["슬픔 가운데 남은 고백", "Lamentations 3", "자비를 기억하는 구절은 고통의 바깥에 있지 않습니다. 탄식의 긴 흐름 안에서 읽어야 합니다."], ["회복을 구하는 기도", "Lamentations 5", "책의 마지막은 손쉬운 결론 대신 회복을 구하는 질문과 기도를 남깁니다."]],
    [["story", "lament-for-zion", "성읍의 탄식"], ["place", "jerusalem", "예루살렘"], ["period", "exile-and-hope", "포로와 소망"]]],
  ["return-to-the-foundations", "다시 놓는 성전의 기초", "Returning to the Foundations", "ezra", "kingdom", "돌아온 가족과 성전의 기초에서 재건의 작고도 어려운 시작을 살펴봅니다.",
    [["돌아오는 사람들", "Ezra 1–2", "귀환은 개인의 귀향이면서 공동체의 재출발입니다. 짐과 가족, 다양한 세대를 함께 바라보세요."], ["기쁨과 눈물이 겹치는 터", "Ezra 3", "성전의 기초를 놓는 날 찬양과 눈물이 함께 들립니다. 사람마다 기억하는 과거가 다릅니다."], ["멈춤 뒤에 이어지는 일", "Ezra 4–6", "재건은 지연과 반대를 거칩니다. 학개와 스가랴의 격려를 성전 완성의 기록과 연결해 읽어 보세요."]],
    [["person", "zerubbabel", "스룹바벨"], ["story", "return-and-second-temple", "귀환과 성전"], ["period", "return-and-rebuilding", "귀환과 재건"]]],
  ["builders-on-the-wall", "성벽을 함께 세우는 손", "Hands Rebuilding the Wall", "nehemiah", "kingdom", "돌을 나르는 사람들과 수리되는 성벽에서 서로 다른 이들의 협력과 공동체의 회복을 봅니다.",
    [["구간마다 참여하는 사람들", "Nehemiah 3", "성벽 재건에는 다양한 가족과 직업의 사람들이 참여합니다. 지도자 한 사람보다 여러 손을 보세요."], ["두려움 속의 협력", "Nehemiah 4", "위협 속에서도 공동체는 경계하며 일합니다. 기도와 실제적인 준비가 함께 나타납니다."], ["벽 안의 삶도 세우기", "Nehemiah 5", "성벽을 높이는 동안 내부의 빚과 착취를 외면할 수 없습니다. 재건은 정의의 문제이기도 합니다."]],
    [["person", "nehemiah", "느헤미야"], ["story", "nehemiah-wall", "성벽 재건"], ["period", "return-and-rebuilding", "공동체의 재건"]]],
  ["job-under-the-sky", "큰 하늘 아래의 질문", "Job beneath the Sky", "job", "wisdom", "홀로 앉은 사람과 드넓은 하늘의 대비를 통해 고난 속의 질문과 성급한 해답의 한계를 생각합니다.",
    [["고통을 겪는 한 사람", "Job 1–3", "욥의 이야기는 고통받는 이를 손쉽게 판단하지 못하게 합니다. 표정과 자세에 담긴 무게를 살펴보세요."], ["친구들의 말과 한계", "Job 4–27", "친구들은 고통의 원인을 설명하려 하지만 욥의 현실을 충분히 듣지 못합니다. 말보다 필요한 돌봄을 생각해 보세요."], ["세계 앞에 선 질문", "Job 38–42", "창조 세계에 관한 질문들은 인간의 이해가 전부가 아님을 드러냅니다. 결말은 논쟁을 넘어선 만남으로 향합니다."]],
    [["person", "job", "욥"], ["story", "job-lament-and-friends", "욥과 친구들"], ["story", "job-wisdom-and-answer", "질문과 응답"]]],
  ["lyre-and-still-waters", "수금과 잔잔한 물가", "A Lyre beside Still Waters", "psalms", "wisdom", "목자의 지팡이와 수금, 잔잔한 물가를 통해 시편의 신뢰와 탄식, 찬양의 언어를 만납니다.",
    [["인도하심의 이미지", "Psalms 23", "목자와 물가, 길과 식탁은 신뢰를 표현하는 시의 언어입니다. 한 장면을 실제 지형의 확정된 복원으로 읽지는 않습니다."], ["탄식도 포함하는 기도", "Psalms 13", "시편에는 언제까지냐는 질문이 있습니다. 고요한 이미지와 고통의 기도를 나란히 놓아 보세요."], ["모든 호흡의 찬양", "Psalms 150", "악기와 사람의 호흡이 함께 찬양하도록 초대받습니다. 시편의 끝을 처음의 기도들과 연결해 보세요."]],
    [["story", "psalms-lament-and-trust", "탄식과 신뢰"], ["story", "songs-of-ascent-and-praise", "순례와 찬양"]]],
  ["learning-in-the-courtyard", "뜰에서 배우는 지혜", "Wisdom in the Courtyard", "proverbs", "wisdom", "스승과 배우는 이의 대화에서 지혜가 말과 거래, 관계와 선택 속에서 자라는 모습을 봅니다.",
    [["귀 기울이는 태도", "Proverbs 1–4", "지혜의 출발은 모든 것을 안다고 여기는 태도를 내려놓고 훈계를 듣는 데 있습니다."], ["일상의 선택", "Proverbs 10–22", "잠언은 말, 게으름, 우정과 정직한 저울처럼 구체적인 일상을 다룹니다. 책상 밖의 삶과 연결해 보세요."], ["기술보다 큰 분별", "Proverbs 3:1–12", "지혜는 영리한 처세만을 뜻하지 않습니다. 신뢰와 겸손, 이웃에 대한 책임이 함께 요구됩니다."]],
    [["story", "wisdom-invitation", "지혜의 초대"], ["story", "wisdom-speech-and-justice", "말과 정의"]]],
  ["isaiah-and-holiness", "거룩함 앞에 선 예언자", "A Prophet before Holiness", "isaiah", "wisdom", "성전의 빛과 연기, 작은 예언자의 모습을 통해 이사야의 부르심과 보냄을 살펴봅니다.",
    [["공간을 채우는 빛", "Isaiah 6:1–4", "성전의 빛과 연기는 환상의 경외감을 표현합니다. 이미지는 하나님의 실제 모습을 재현하지 않습니다."], ["자신을 돌아보는 고백", "Isaiah 6:5–7", "예언자는 먼저 자신의 부정함을 고백합니다. 부르심은 다른 이들을 판단하는 권위로만 시작되지 않습니다."], ["누가 갈 것인가", "Isaiah 6:8–13", "정결하게 된 예언자는 보냄에 응답합니다. 아름다운 장면 뒤에 놓인 어려운 사명까지 읽어 보세요."]],
    [["person", "isaiah", "이사야"], ["story", "isaiah-holiness-and-trust", "거룩함과 신뢰"]]],
  ["daniel-in-the-den", "사자굴에서 지킨 기도", "Daniel in the Lions’ Den", "daniel", "wisdom", "어두운 돌과 내려오는 빛, 기도하는 다니엘을 통해 제국 안에서 신앙을 지키는 삶을 생각합니다.",
    [["위기 이전의 일상", "Daniel 6:1–10", "다니엘의 기도는 위기 때만의 행동이 아니라 이어 오던 일상입니다. 충실함이 쌓이는 시간을 보세요."], ["굴 안의 고요함", "Daniel 6:11–23", "위협과 평온의 대비는 구원의 이야기를 표현합니다. 장면의 긴장을 폭력의 구경거리로 바꾸지 않습니다."], ["권력의 한계", "Daniel 6:24–28", "왕의 조서와 제국의 질서 너머에 있는 하나님의 주권이 이야기의 결말에서 드러납니다."]],
    [["person", "daniel", "다니엘"], ["place", "babylon", "바벨론"], ["period", "exile-and-hope", "포로와 소망"]]],
  ["river-of-restoration", "메마른 땅으로 흐르는 강", "A River of Restoration", "ezekiel", "wisdom", "성소에서 흘러나온 물과 살아나는 강변에서 에스겔이 본 회복의 환상을 만납니다.",
    [["성소에서 시작되는 물", "Ezekiel 47:1–6", "물은 점점 깊어집니다. 강의 흐름을 따라 시선이 이동하도록 장면을 바라보세요."], ["살아나는 땅과 생명", "Ezekiel 47:7–12", "강물이 이르는 곳에 생명과 나무가 살아납니다. 포로 공동체를 향한 회복의 약속과 연결됩니다."], ["환상의 언어 읽기", "Ezekiel 40–48", "이는 본문이 전하는 환상을 바탕으로 한 시각적 해석입니다. 실제 건축 도면이나 고고학적 사진과는 구별됩니다."]],
    [["person", "ezekiel", "에스겔"], ["story", "dry-bones-and-new-heart", "새 마음의 약속"]]],
  ["teaching-on-the-hillside", "언덕 위에서 듣는 말씀", "Teaching on the Hillside", "matthew", "gospel", "갈릴리의 언덕과 모인 무리 속에서 예수의 가르침이 일상의 삶을 어떻게 부르는지 살펴봅니다.",
    [["가르치는 이와 듣는 이들", "Matthew 5:1–12", "팔복은 힘과 성공만으로 사람을 판단하는 시선을 바꿉니다. 다양한 사람들이 함께 듣는 모습을 보세요."], ["드러나는 삶", "Matthew 5:13–16", "소금과 빛의 비유는 사람들 앞에서 드러나는 선한 삶을 말합니다. 가르침은 언덕 아래의 일상으로 이어집니다."], ["듣고 행하는 사람", "Matthew 7:24–29", "설교는 말씀을 듣고 행하라는 요청으로 끝납니다. 장면을 감상한 뒤 어떤 실천이 필요한지 질문해 보세요."]],
    [["person", "jesus", "예수 그리스도"], ["place", "galilee", "갈릴리"], ["story", "sermon-on-the-mount", "산 위의 가르침"]]],
  ["boat-after-the-storm", "폭풍 뒤 갈릴리의 배", "A Boat after the Storm", "mark", "gospel", "거친 물결과 가라앉는 바다의 대비를 통해 제자들의 두려움과 예수를 향한 질문을 읽습니다.",
    [["작은 배와 큰 바다", "Mark 4:35–38", "배 안의 제자들은 익숙한 바다에서도 두려움을 느낍니다. 사람과 파도의 크기를 비교해 보세요."], ["고요함 뒤에 남은 질문", "Mark 4:39–41", "폭풍이 잠잠해진 뒤 제자들은 예수가 누구인지 묻습니다. 사건은 안전한 항해 이상의 질문을 남깁니다."], ["이후에도 이어지는 배움", "Mark 8:27–38", "예수를 알아 가는 길은 십자가와 제자도의 가르침으로 이어집니다. 기적만으로 복음서 전체를 대신하지 않습니다."]],
    [["person", "jesus", "예수 그리스도"], ["story", "mark-authority-and-mercy", "권위와 긍휼"], ["period", "life-of-jesus", "예수의 사역"]]],
  ["neighbor-on-the-road", "길 위에서 이웃이 되다", "Becoming a Neighbor", "luke", "gospel", "멈춰 선 나그네와 돌봄의 손길을 통해 선한 사마리아인 비유의 질문을 따라갑니다.",
    [["지나침과 멈춤", "Luke 10:25–33", "비유의 길에는 같은 고통을 보고도 다른 선택을 하는 사람들이 등장합니다. 돌보는 이의 자세에 주목하세요."], ["돌봄에 드는 시간과 비용", "Luke 10:34–35", "가까이 가고 태우고 맡기는 구체적인 행동은 긍휼이 감정에 머물지 않음을 보여 줍니다."], ["누가 이웃이 되었는가", "Luke 10:36–37", "예수는 경계 안의 이웃을 고르는 대신 고통받는 사람의 이웃이 되는 길을 묻습니다."]],
    [["person", "jesus", "예수 그리스도"], ["story", "luke-mercy-and-table", "긍휼과 식탁"]]],
  ["conversation-at-the-well", "우물가에서 시작된 대화", "A Conversation at the Well", "john", "gospel", "돌우물과 물동이, 서로 마주한 두 사람을 통해 생명의 물과 경계를 넘는 만남을 읽습니다.",
    [["물을 청하는 말", "John 4:1–15", "예수는 물을 달라는 요청으로 대화를 시작합니다. 평범한 만남이 생명의 물에 관한 질문으로 깊어집니다."], ["예배의 자리를 묻다", "John 4:16–26", "대화는 삶의 현실과 예배로 이어집니다. 서로의 시선과 대화 사이의 거리를 살펴보세요."], ["마을로 이어지는 증언", "John 4:27–42", "여인은 마을로 돌아가 만남을 전합니다. 한 사람의 대화는 공동체의 질문과 믿음으로 확장됩니다."]],
    [["person", "jesus", "예수 그리스도"], ["place", "samaria", "사마리아"], ["story", "john-signs-and-life", "표적과 만남"]]],
  ["pentecost-gathering", "오순절의 모인 사람들", "The Pentecost Gathering", "acts", "gospel", "함께 기도하는 사람들과 불같은 빛의 표현을 통해 성령과 증언의 시작을 살펴봅니다.",
    [["함께 기다리는 공동체", "Acts 1:12–14", "성령을 기다리는 이들은 한자리에 모여 기도합니다. 장면의 중심은 특별한 건물이 아니라 모인 사람들입니다."], ["다양한 언어로 들리는 소식", "Acts 2:1–13", "각자의 언어로 들리는 증언은 서로 다른 배경을 지닌 사람들에게 향합니다. 불같은 빛은 본문의 표현을 해석한 것입니다."], ["나눔으로 이어지는 변화", "Acts 2:42–47", "성령의 사건 뒤에는 가르침과 식탁, 기도와 필요를 돌보는 공동체의 삶이 이어집니다."]],
    [["story", "pentecost-and-witness", "오순절과 증인들"], ["person", "peter", "베드로"], ["period", "birth-of-church", "초대교회의 시작"]]],
  ["new-jerusalem-and-river", "새 예루살렘과 생명의 강", "New Jerusalem & the River", "revelation", "gospel", "빛나는 성읍과 생명의 강, 강변의 나무를 통해 요한계시록 마지막 장면의 회복을 바라봅니다.",
    [["하나님이 함께하시는 성읍", "Revelation 21:1–8", "새 하늘과 새 땅의 소망은 눈물과 죽음이 사라지고 하나님이 사람들과 함께하신다는 약속으로 표현됩니다."], ["강과 생명나무", "Revelation 22:1–5", "생명의 강과 나무는 창세기의 동산을 떠올리게 합니다. 치유와 빛의 이미지를 따라 읽어 보세요."], ["과거의 도시가 아닌 소망의 환상", "Revelation 21–22", "이 장면은 이미 지나간 역사에 해당하지 않습니다. 요한계시록의 상징적 환상을 바탕으로 한 소망의 이미지입니다."]],
    [["place", "new-jerusalem", "새 예루살렘"], ["story", "new-jerusalem-and-life", "새 예루살렘과 생명"], ["person", "john-of-patmos", "밧모섬의 요한"]]],
];

export const visualEntries: VisualEntry[] = visualInputs.map(([slug, titleKo, titleEn, book, collection, summary, points, links], index) => ({
  type: "visual", slug, titleKo, titleEn, collection, order: index + 1,
  eyebrow: `VISUAL · ${visualCollections.find(item => item.id === collection)!.label}`,
  summary, overview: `${summary} ${points[0][2]} ${points[2][2]}`,
  heroImage: `/assets/bible/${book}.webp`, scripture: points.map(point => point[1]),
  observations: points.map(([title, , description]) => ({ title, description })),
  relations: relations([["book", book, "관련 성경 읽기"], ...links]),
}));

export const explorationNodes: ContentNode[] = [...timelinePeriods, ...visualEntries];
export const explorationOrder = new Map(explorationNodes.map((node, index) => [`${node.type}:${node.slug}`, index + 1]));
