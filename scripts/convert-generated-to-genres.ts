import fs from "fs";
import path from "path";
import sharp from "sharp";

const ARTIFACTS_DIR = "/Users/a1234/.gemini/antigravity-ide/brain/ac6f736b-c5c4-4bf7-a849-b8295556558b";
const TARGET_DIR = path.resolve(process.cwd(), "public/images/genres");

// 매핑 정의
const mappings = [
  { src: "genre_alternative_1783739382585.png", dest: "Alternative.webp" },
  { src: "genre_post_rock_1783739397947.png", dest: "Post_Rock.webp" },
  { src: "genre_traditional_country_1783739413379.png", dest: "Traditional_Country.webp" },
  { src: "genre_modern_country_1783739431303.png", dest: "Modern_Country.webp" },
  { src: "genre_ska_1783739445997.png", dest: "Ska.webp" },
  { src: "genre_funk_1783739461219.png", dest: "Funk.webp" },
  { src: "genre_epic_classical_1783739476049.png", dest: "Epic_Classical.webp" },
  { src: "genre_dramatic_classical_1783739493337.png", dest: "Dramatic_Classical.webp" },
  { src: "genre_choir_1783739507741.png", dest: "Choir.webp" },
  { src: "genre_gospel_1783739524857.png", dest: "Gospel.webp" },
  { src: "genre_world_1783739540709.png", dest: "World.webp" },
  { src: "genre_arabic_1783739561738.png", dest: "Arabic.webp" },
  { src: "genre_modern_blues_1783739826314.png", dest: "Modern_Blues.webp" },
  { src: "genre_upbeat_1783739849391.png", dest: "Upbeat.webp" },
  { src: "genre_beats_1783739871799.png", dest: "Beats.webp" },
  { src: "genre_main_title_1783739892510.png", dest: "Main_Title.webp" },
  { src: "genre_build_up_scenes_1783739908232.png", dest: "Build_Up_Scenes.webp" },
  { src: "genre_corporate_1783739930206.png", dest: "Corporate.webp" },
  { src: "genre_neo_classical_1783740371284.png", dest: "Neo_Classical.webp" },
  { src: "genre_cinematic_post_rock_1783740387786.png", dest: "Cinematic_Post_Rock.webp" },
  { src: "genre_asmr_textural_soundscape_1783740411102.png", dest: "ASMR___Textural_Soundscape.webp" },
  { src: "genre_glitch_hop_1783740431111.png", dest: "Glitch_Hop.webp" },
  { src: "genre_cafe_1783742361662.png", dest: "Cafe.webp" },
  { src: "genre_vintage_1783740454137.png", dest: "Vintage.webp" },
  { src: "genre_nostalgia_1783740479752.png", dest: "Nostalgia.webp" },
  { src: "genre_christmas_1783740496432.png", dest: "Christmas.webp" },
  { src: "genre_wedding_1783740521960.png", dest: "Wedding.webp" },
  { src: "genre_small_drama_1783740651827.png", dest: "Small_Drama.webp" },
  { src: "genre_drama_scene_1783740677097.png", dest: "Drama_Scene.webp" },
  { src: "genre_jingles_1783740696855.png", dest: "Jingles.webp" },
  { src: "genre_vaudeville_variety_show_1783740722680.png", dest: "Vaudeville___Variety_Show.webp" },
  { src: "genre_show_dance_1783740741231.png", dest: "Show_Dance.webp" },
  { src: "genre_tragedy_1783740768749.png", dest: "Tragedy.webp" },
  { src: "genre_bloopers_1783740794530.png", dest: "Bloopers.webp" },
  { src: "genre_elevator_music_1783740818471.png", dest: "Elevator_Music.webp" },
  { src: "genre_small_emotions_1783740889819.png", dest: "Small_Emotions.webp" },
  { src: "genre_supernatural_1783740909228.png", dest: "Supernatural.webp" },
  { src: "genre_special_occasions_1783740940335.png", dest: "Special_Occasions.webp" },
  { src: "genre_eccentric_quirky_1783740959463.png", dest: "Eccentric___Quirky.webp" },
  { src: "genre_funerals_1783740986650.png", dest: "Funerals.webp" },
  { src: "genre_religious_theme_1783741012832.png", dest: "Religious_Theme.webp" },
  { src: "genre_amusement_park_1783741045772.png", dest: "Amusement_Park.webp" },
  { src: "genre_military_historical_1783741072242.png", dest: "Military___Historical.webp" },
  { src: "genre_scary_childrens_tunes_1783741177981.png", dest: "Scary_Childrens_Tunes.webp" },
  { src: "genre_happy_childrens_tunes_1783741201154.png", dest: "Happy_Childrens_Tunes.webp" },
  { src: "genre_fantasy_dreamy_childrens_1783741225155.png", dest: "Fantasy___Dreamy_Childrens_.webp" },
  { src: "genre_usa_1783741246764.png", dest: "Usa.webp" },
  { src: "genre_beautiful_plays_1783741272578.png", dest: "Beautiful_Plays.webp" },
  { src: "genre_acoustic_group_1783741306844.png", dest: "Acoustic_Group.webp" },
  { src: "genre_solo_instruments_1783741328186.png", dest: "Solo_Instruments.webp" },
  { src: "genre_solo_classical_instruments_1783741366373.png", dest: "Solo_Classical_Instruments.webp" },
  { src: "genre_marching_band_1783741441855.png", dest: "Marching_Band.webp" },
  { src: "genre_oompah_band_1783741480698.png", dest: "Oompah_Band.webp" },
  { src: "genre_classical_string_quartet_1783741510683.png", dest: "Classical_String_Quartet.webp" },
  { src: "genre_big_band_1783741552470.png", dest: "Big_Band.webp" },
  { src: "genre_high_drones_1783741595366.png", dest: "High_Drones.webp" },
  { src: "genre_pulses_1783741641035.png", dest: "Pulses.webp" },
  { src: "genre_low_drones_1783741683971.png", dest: "Low_Drones.webp" },
  { src: "genre_abstract_1783741715267.png", dest: "Abstract.webp" },
  { src: "genre_high_rhythmic_drones_1783741846114.png", dest: "High_Rhythmic_Drones.webp" },
  { src: "genre_low_rhythmic_drones_1783741877576.png", dest: "Low_Rhythmic_Drones.webp" },
  { src: "genre_high_non_rhythmic_drones_1783741907230.png", dest: "High_Non_Rhythmic_Drones.webp" },
  { src: "genre_low_non_rhythmic_drones_1783741937992.png", dest: "Low_Non_Rhythmic_Drones.webp" },
  { src: "genre_percussion_1783741965854.png", dest: "Percussion.webp" },
  { src: "genre_oomph_volume2_1783741993218.png", dest: "Oomph___Volume2.webp" },
  { src: "genre_synthwave_retrowave_1783742017476.png", dest: "Synthwave___Retrowave.webp" }
];

async function convertAndCopy() {
  console.log("🚀 Starting generation WebP conversion...");
  
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  for (const m of mappings) {
    const srcPath = path.join(ARTIFACTS_DIR, m.src);
    const destPath = path.join(TARGET_DIR, m.dest);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Warning: Source file not found: ${m.src}`);
      continue;
    }

    try {
      console.log(`[CONVERT] "${m.src}" ➔ "${m.dest}"`);
      const originalBuffer = fs.readFileSync(srcPath);

      // sharp로 WebP (품질 90) 인코딩
      const webpBuffer = await sharp(originalBuffer)
        .webp({ quality: 90, effort: 6 })
        .toBuffer();

      fs.writeFileSync(destPath, webpBuffer);
      console.log(`✅ Success: Saved to ${destPath}`);

    } catch (err: any) {
      console.error(`❌ Failed: ${m.src} -`, err.message);
    }
  }

  console.log("🎉 WebP Conversion completed!");
}

convertAndCopy().catch((err) => {
  console.error("💥 Execution error:", err);
});
