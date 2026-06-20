const fs = require("fs");
const path = require("path");

const fileMapping = {
  "자연 & 풍경": "categories_nature.json",
  "동식물 & 자연생태": "categories_flora_fauna.json",
  "인물 & 라이프스타일": "categories_lifestyle.json",
  "비즈니스 & 테크": "categories_business_tech.json",
  "판타지 & SF": "categories_fantasy_scifi.json",
  "예술 & 추상화": "categories_art_abstract.json",
  "푸드 & 베버리지": "categories_food_beverage.json",
  "시즌 & 기념일": "categories_holiday_seasons.json",
  "건축 & 인테리어": "categories_architecture.json",
  "스포츠 & 헬스": "categories_sports_health.json",
  "질감 & 목업 배경": "categories_textures_mockups.json",
  "교육 & 의료/과학": "categories_education_healthcare.json"
};

function splitJsonCategories() {
  const sourcePath = path.join(__dirname, "categories_1000.json");
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source JSON file not found at: ${sourcePath}`);
  }

  console.log("Reading source categories_1000.json (2,400 items)...");
  const categories = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  // 각 대분류별로 분류하여 개별 파일로 쓰기 (총 12개 파일)
  Object.keys(fileMapping).forEach((primaryTitle) => {
    const fileName = fileMapping[primaryTitle];
    const targetPath = path.join(__dirname, fileName);

    const filtered = categories.filter(item => item.primary === primaryTitle);
    
    fs.writeFileSync(targetPath, JSON.stringify(filtered, null, 2), "utf8");
    console.log(`Created split JSON [${primaryTitle}] -> ${fileName} (${filtered.length} items)`);
  });

  console.log("All 12 JSON files successfully partitioned!");
}

splitJsonCategories();
