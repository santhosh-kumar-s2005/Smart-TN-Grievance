export function calculatePriority({
  text = "",
  department = "",
  locationType = "residential",
}: {
  text?: string;
  department?: string;
  locationType?: string;
}) {
  const t = text.toLowerCase();

  let lifeSafety = 0;
  let infrastructureImpact = 0;
  let serviceDisruption = 0;
  let urgencyScore = 0;
  let exposureScore = 0;

  // 1️⃣ LIFE SAFETY (0–40)
  if (t.includes("fire") || t.includes("explosion")) {
    lifeSafety = 40;
  } else if (
    t.includes("live wire") ||
    t.includes("electrocution") ||
    t.includes("danger")
  ) {
    lifeSafety = 30;
  } else if (
    t.includes("pothole") ||
    t.includes("leak") ||
    t.includes("overflow")
  ) {
    lifeSafety = 20;
  } else if (t.includes("broken") || t.includes("not working")) {
    lifeSafety = 10;
  }

  // 2️⃣ INFRASTRUCTURE IMPACT (0–25)
  if (locationType === "hospital" || locationType === "school") {
    infrastructureImpact = 25;
  } else if (locationType === "main_road") {
    infrastructureImpact = 20;
  } else if (locationType === "residential") {
    infrastructureImpact = 15;
  } else {
    infrastructureImpact = 10;
  }

  // 3️⃣ SERVICE DISRUPTION (0–15)
  if (
    t.includes("no power") ||
    t.includes("power cut") ||
    t.includes("water not coming")
  ) {
    serviceDisruption = 15;
  } else if (t.includes("partial") || t.includes("low pressure")) {
    serviceDisruption = 10;
  } else if (t.includes("delay")) {
    serviceDisruption = 5;
  }

  // 4️⃣ URGENCY (0–10)
  if (
    t.includes("urgent") ||
    t.includes("immediately") ||
    t.includes("accident")
  ) {
    urgencyScore = 10;
  } else if (t.includes("serious") || t.includes("danger")) {
    urgencyScore = 7;
  } else if (t.includes("issue")) {
    urgencyScore = 3;
  }

  // 5️⃣ EXPOSURE (0–10)
  if (locationType === "public_area") {
    exposureScore = 10;
  } else if (locationType === "main_road") {
    exposureScore = 8;
  } else if (locationType === "residential") {
    exposureScore = 5;
  } else {
    exposureScore = 2;
  }

  const totalScore =
    lifeSafety +
    infrastructureImpact +
    serviceDisruption +
    urgencyScore +
    exposureScore;

  let priority = "Minimal";

  if (totalScore >= 80) priority = "Critical";
  else if (totalScore >= 60) priority = "High";
  else if (totalScore >= 40) priority = "Medium";
  else if (totalScore >= 20) priority = "Low";

  return {
    totalScore,
    priority,
  };
}
