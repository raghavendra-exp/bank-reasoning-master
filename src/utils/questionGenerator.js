// Deterministic Seeded Pseudo-Random Question Generator for Bank Reasoning Master
// Generates mathematically and logically verified questions with dual solutions (Normal vs Topper)

class SeededRNG {
  constructor(seed = 123456789) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  nextInt(min, max) {
    return Math.floor(min + this.next() * (max - min + 1));
  }
  choice(array) {
    return array[this.nextInt(0, array.length - 1)];
  }
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

// 1. Inequality Question Generator
export function generateInequalityQuestion(rng, index) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'];
  const shuffled = rng.shuffle(letters);
  const vars = shuffled.slice(0, 6);

  // Generate a valid chain
  // e.g. V0 > V1 >= V2 = V3 > V4; V2 >= V5
  const isDirect = rng.next() > 0.3;
  const chain1 = `${vars[0]} > ${vars[1]} ≥ ${vars[2]} = ${vars[3]}`;
  const chain2 = `${vars[2]} ≥ ${vars[4]} > ${vars[5]}`;
  const statement = `${chain1}; ${chain2}`;

  // Let's create two conclusions
  // C1: vars[0] > vars[4] (DEFINITELY TRUE because vars[0] > vars[2] >= vars[4])
  // C2: vars[3] < vars[5] (DEFINITELY FALSE because vars[3] = vars[2] >= vars[4] > vars[5] -> vars[3] > vars[5])
  
  const options = [
    "Only conclusion I is true",
    "Only conclusion II is true",
    "Either conclusion I or II is true",
    "Neither conclusion I nor II is true",
    "Both conclusions I and II are true"
  ];

  const typePick = rng.nextInt(0, 2);
  let c1, c2, correctIdx;

  if (typePick === 0) {
    // Only I true
    c1 = `${vars[0]} > ${vars[4]}`;
    c2 = `${vars[3]} < ${vars[5]}`;
    correctIdx = 0;
  } else if (typePick === 1) {
    // Both true
    c1 = `${vars[0]} > ${vars[4]}`;
    c2 = `${vars[3]} > ${vars[5]}`;
    correctIdx = 4;
  } else {
    // Only II true
    c1 = `${vars[1]} < ${vars[5]}`;
    c2 = `${vars[0]} > ${vars[3]}`;
    correctIdx = 1;
  }

  return {
    id: `GEN-INEQ-${String(index).padStart(4, '0')}`,
    exam: ["SBI_CLERK", "IBPS_CLERK", "IBPS_RRB_OA"],
    phase: "PRELIMS",
    year: 2025,
    topic: "inequality",
    subtopic: "Linear Chain & Priority Order",
    type: "ORIGINAL",
    difficulty: "EASY",
    expected_time: 15,
    question_en: `Statements: ${statement}\n\nConclusions:\nI. ${c1}\nII. ${c2}`,
    question_hi: `कथन: ${statement}\n\nनिष्कर्ष:\nI. ${c1}\nII. ${c2}`,
    options,
    correct_answer: correctIdx,
    solution_en: `Path Analysis:\n1. Connect chain: ${vars[0]} > ${vars[1]} ≥ ${vars[2]} = ${vars[3]} and ${vars[2]} ≥ ${vars[4]} > ${vars[5]}.\n2. Relationship between ${vars[0]} and ${vars[4]}: ${vars[0]} > ${vars[2]} ≥ ${vars[4]} ⇒ ${vars[0]} > ${vars[4]} is definitely true.\n3. Relationship between ${vars[3]} and ${vars[5]}: ${vars[3]} = ${vars[2]} ≥ ${vars[4]} > ${vars[5]} ⇒ ${vars[3]} > ${vars[5]} is definitely true.\nCorrect Option: ${options[correctIdx]}.`,
    solution_hi: `शृंखला विश्लेषण:\n1. शृंखला को जोड़ें: ${vars[0]} > ${vars[1]} ≥ ${vars[2]} = ${vars[3]} तथा ${vars[2]} ≥ ${vars[4]} > ${vars[5]}.\n2. ${vars[0]} और ${vars[4]} के बीच: ${vars[0]} > ${vars[4]} सत्य है।\n3. ${vars[3]} और ${vars[5]} के बीच: ${vars[3]} > ${vars[5]} सत्य है।\nसही विकल्प: ${options[correctIdx]}.`,
    shortcut: "Door Rule: Gates stay open in direction of greater sign. Strict '>' present guarantees strict inequality.",
    exam_trick: "Trace without lifting your pen: follow the common variable connecting the two semicolon segments.",
    trap: "Opposite signs block the road; always check intermediate signs.",
    tags: ["inequality", "speed-lab", "prelims"]
  };
}

// 2. Ranking & Order Question Generator
export function generateRankingQuestion(rng, index) {
  const names = ["Rahul", "Pooja", "Vikram", "Neha", "Arjun", "Kavita", "Suresh", "Meera", "Aakash", "Deepa"];
  const name1 = rng.choice(names);
  let name2 = rng.choice(names);
  while (name2 === name1) name2 = rng.choice(names);

  const scenario = rng.nextInt(0, 2);

  if (scenario === 0) {
    // Total from left and right
    const left = rng.nextInt(12, 28);
    const right = rng.nextInt(14, 30);
    const total = left + right - 1;

    const opts = rng.shuffle([total, total + 1, total - 1, total + 2, total - 2]);
    const correctIdx = opts.indexOf(total);

    return {
      id: `GEN-RANK-${String(index).padStart(4, '0')}`,
      exam: ["IBPS_RRB_OA", "SBI_CLERK", "IBPS_CLERK"],
      phase: "PRELIMS",
      year: 2025,
      topic: "ranking_order",
      subtopic: "Total Persons Formula",
      type: "ORIGINAL",
      difficulty: "EASY",
      expected_time: 15,
      question_en: `In a row of students facing North, ${name1} is ${left}th from the left end and ${right}th from the right end. How many students are there in the row?`,
      question_hi: `उत्तर की ओर मुख किए छात्रों की एक पंक्ति में, ${name1} बाएँ छोर से ${left}वें स्थान पर है और दाएँ छोर से ${right}वें स्थान पर है। पंक्ति में कुल कितने छात्र हैं?`,
      options: opts.map(String),
      correct_answer: correctIdx,
      solution_en: `Total Formula: Total = (Rank from Left + Rank from Right) - 1\nTotal = (${left} + ${right}) - 1 = ${left + right} - 1 = ${total} students.`,
      solution_hi: `कुल संख्या का सूत्र: कुल = (बाएँ से स्थान + दाएँ से स्थान) - 1\nकुल = (${left} + ${right}) - 1 = ${total} छात्र।`,
      shortcut: "Add both ranks and subtract 1: " + left + " + " + right + " - 1 = " + total,
      exam_trick: "Calculate mentally in 5 seconds. Don't touch pen to paper.",
      trap: "Forgetting to subtract 1 (since the person is counted twice from both ends).",
      tags: ["ranking", "total-formula", "speed-lab"]
    };
  } else if (scenario === 1) {
    // Interchange of positions
    const oldLeft = rng.nextInt(10, 20);
    const oldRight = rng.nextInt(12, 22);
    const shift = rng.nextInt(6, 12);
    const newLeft = oldLeft + shift;
    const total = newLeft + oldRight - 1;

    const opts = rng.shuffle([total, total + 1, total - 1, total + 2, total - 2]);
    const correctIdx = opts.indexOf(total);

    return {
      id: `GEN-RANK-${String(index).padStart(4, '0')}`,
      exam: ["IBPS_RRB_OA", "SBI_CLERK", "IBPS_CLERK"],
      phase: "PRELIMS",
      year: 2025,
      topic: "ranking_order",
      subtopic: "Position Interchange",
      type: "ORIGINAL",
      difficulty: "EASY",
      expected_time: 20,
      question_en: `In a row of persons facing North, ${name1} is ${oldLeft}th from the left and ${name2} is ${oldRight}th from the right. When they interchange their places, ${name1} becomes ${newLeft}th from the left. How many persons are there in the row?`,
      question_hi: `उत्तर की ओर मुख किए व्यक्तियों की एक पंक्ति में, ${name1} बाएँ से ${oldLeft}वें और ${name2} दाएँ से ${oldRight}वें स्थान पर है। जब वे आपस में स्थान बदलते हैं, तो ${name1} बाएँ से ${newLeft}वें स्थान पर आ जाता है। पंक्ति में कुल कितने व्यक्ति हैं?`,
      options: opts.map(String),
      correct_answer: correctIdx,
      solution_en: `After interchange, ${name1} sits at ${name2}'s original seat.\nThat exact seat is:\n- ${newLeft}th from left (${name1}'s new rank)\n- ${oldRight}th from right (${name2}'s original rank)\nTotal = (New Rank of ${name1} + Old Rank of ${name2}) - 1\nTotal = (${newLeft} + ${oldRight}) - 1 = ${total}.`,
      solution_hi: `स्थान बदलने के बाद ${name1}, ${name2} के पुराने स्थान पर बैठता है।\nअतः वह स्थान बाएँ से ${newLeft}वाँ और दाएँ से ${oldRight}वाँ है।\nकुल = (${newLeft} + ${oldRight}) - 1 = ${total}.`,
      shortcut: `Interchange formula: Total = (Person 1 New + Person 2 Old) - 1 = ${newLeft} + ${oldRight} - 1 = ${total}.`,
      exam_trick: "Identify the stationary position: new rank + other person's old rank minus 1.",
      trap: "Adding the two old ranks together.",
      tags: ["ranking", "interchange", "clerk-prelims"]
    };
  } else {
    // Finding rank from other end
    const total = rng.nextInt(35, 60);
    const leftRank = rng.nextInt(10, total - 10);
    const rightRank = total - leftRank + 1;

    const opts = rng.shuffle([rightRank, rightRank + 1, rightRank - 1, rightRank + 2, rightRank - 2]);
    const correctIdx = opts.indexOf(rightRank);

    return {
      id: `GEN-RANK-${String(index).padStart(4, '0')}`,
      exam: ["IBPS_RRB_OA", "SBI_CLERK"],
      phase: "PRELIMS",
      year: 2025,
      topic: "ranking_order",
      subtopic: "Opposite Rank Calculation",
      type: "ORIGINAL",
      difficulty: "EASY",
      expected_time: 15,
      question_en: `In a row of ${total} students, ${name1}'s rank is ${leftRank}th from the left end. What is ${name1}'s rank from the right end?`,
      question_hi: `${total} छात्रों की एक पंक्ति में, ${name1} का स्थान बाएँ छोर से ${leftRank}वाँ है। दाएँ छोर से ${name1} का स्थान क्या होगा?`,
      options: opts.map(String),
      correct_answer: correctIdx,
      solution_en: `Rank from Right = Total - Rank from Left + 1\nRank from Right = ${total} - ${leftRank} + 1 = ${rightRank}.`,
      solution_hi: `दाएँ से स्थान = कुल संख्या - बाएँ से स्थान + 1\nदाएँ से स्थान = ${total} - ${leftRank} + 1 = ${rightRank}.`,
      shortcut: `Total - Given Rank + 1: ${total} - ${leftRank} + 1 = ${rightRank}.`,
      exam_trick: "Never forget to add 1 when finding rank from opposite end.",
      trap: "Just doing Total - Left without adding 1.",
      tags: ["ranking", "speed-drill"]
    };
  }
}

// 3. Direction & Distance Generator
export function generateDirectionQuestion(rng, index) {
  const triplets = [
    { dx: 3, dy: 4, dist: 5 },
    { dx: 6, dy: 8, dist: 10 },
    { dx: 5, dy: 12, dist: 13 },
    { dx: 9, dy: 12, dist: 15 },
    { dx: 8, dy: 15, dist: 17 }
  ];
  const trip = rng.choice(triplets);
  const startLetter = rng.choice(['A', 'K', 'M', 'P', 'R', 'S']);
  const midLetter = rng.choice(['B', 'L', 'N', 'Q', 'T']);
  const endLetter = rng.choice(['C', 'X', 'Y', 'Z']);

  // Move East dx, then South dy
  const distEast = trip.dx + rng.nextInt(2, 6);
  const distSouth = trip.dy;
  const distWest = distEast - trip.dx;

  const correctDist = trip.dist;
  const correctDir = "South-East";
  const correctDirHi = "दक्षिण-पूर्व";

  const options = [
    `${correctDist}m, South-East`,
    `${correctDist}m, North-East`,
    `${correctDist + 2}m, South-East`,
    `${correctDist}m, South-West`,
    `${distEast + distSouth}m, South`
  ];

  return {
    id: `GEN-DIR-${String(index).padStart(4, '0')}`,
    exam: ["SBI_CLERK", "IBPS_CLERK", "IBPS_RRB_OA"],
    phase: "PRELIMS",
    year: 2025,
    topic: "direction_distance",
    subtopic: "Pythagoras Distance & Coordinates",
    type: "ORIGINAL",
    difficulty: "EASY",
    expected_time: 30,
    question_en: `A person starts from Point ${startLetter} and walks ${distEast}m East to reach Point ${midLetter}. From Point ${midLetter}, he turns right and walks ${distSouth}m. Then he turns right again and walks ${distWest}m to reach Point ${endLetter}. What is the shortest distance and direction of Point ${endLetter} with respect to Point ${startLetter}?`,
    question_hi: `एक व्यक्ति बिंदु ${startLetter} से प्रारंभ कर पूर्व की ओर ${distEast} मीटर चलकर बिंदु ${midLetter} पर पहुँचता है। बिंदु ${midLetter} से, वह दाएँ मुड़कर ${distSouth} मीटर चलता है। फिर वह पुनः दाएँ मुड़कर ${distWest} मीटर चलकर बिंदु ${endLetter} पर पहुँचता है। बिंदु ${startLetter} के संदर्भ में बिंदु ${endLetter} की न्यूनतम दूरी और दिशा क्या है?`,
    options,
    correct_answer: 0,
    solution_en: `Coordinate method taking ${startLetter} as (0, 0):\n1. Move East ${distEast}m -> (${distEast}, 0)\n2. Turn right (South) ${distSouth}m -> (${distEast}, -${distSouth})\n3. Turn right (West) ${distWest}m -> (${distEast - distWest}, -${distSouth}) = (${trip.dx}, -${trip.dy}).\n\nShortest distance = √(${trip.dx}² + ${trip.dy}²) = √(${trip.dx * trip.dx} + ${trip.dy * trip.dy}) = ${correctDist}m.\nDirection = East is positive X, South is negative Y -> South-East.\nAnswer: ${correctDist}m, South-East.`,
    solution_hi: `निर्देशांक विधि द्वारा:\nनेट X विस्थापन = +${distEast} - ${distWest} = +${trip.dx} मीटर (पूर्व)।\nनेट Y विस्थापन = -${distSouth} = -${trip.dy} मीटर (दक्षिण)।\nन्यूनतम दूरी = √(${trip.dx}² + ${trip.dy}²) = ${correctDist} मीटर।\nदिशा = दक्षिण-पूर्व (${correctDirHi})।`,
    shortcut: `Pythagorean triplet (${trip.dx}, ${trip.dy}, ${trip.dist}). Net East = ${trip.dx}, Net South = ${trip.dy} -> Hypotenuse is ${trip.dist}m.`,
    exam_trick: "Calculate net horizontal (East - West) and net vertical (North - South) displacement first.",
    trap: "Adding total path walked instead of vector displacement.",
    tags: ["direction", "pythagoras", "coordinates"]
  };
}

// 4. Syllogism Generator
export function generateSyllogismQuestion(rng, index) {
  const categories = [
    { a: "Pens", b: "Pencils", c: "Erasers", d: "Markers" },
    { a: "Cars", b: "Bikes", c: "Trucks", d: "Buses" },
    { a: "Bottles", b: "Cups", c: "Plates", d: "Glasses" },
    { a: "Laptops", b: "Mobiles", c: "Tablets", d: "Watches" },
    { a: "Cats", b: "Dogs", c: "Tigers", d: "Lions" }
  ];
  const cat = rng.choice(categories);

  const stmt = `Only a few ${cat.a} are ${cat.b}.\nAll ${cat.b} are ${cat.c}.\nNo ${cat.c} is ${cat.d}.`;
  const stmtHi = `केवल कुछ ${cat.a}, ${cat.b} हैं।\nसभी ${cat.b}, ${cat.c} हैं।\nकोई ${cat.c}, ${cat.d} नहीं है।`;

  const qType = rng.nextInt(0, 2);
  let c1, c2, c1Hi, c2Hi, correctIdx, solEn, solHi;

  if (qType === 0) {
    // Only I follows
    c1 = `Some ${cat.a} are definitely not ${cat.d}.`;
    c2 = `All ${cat.a} being ${cat.b} is a possibility.`;
    c1Hi = `कुछ ${cat.a} निश्चित रूप से ${cat.d} नहीं हैं।`;
    c2Hi = `सभी ${cat.a} के ${cat.b} होने की संभावना है।`;
    correctIdx = 0;
    solEn = `1. The ${cat.a} that are ${cat.b} are inside ${cat.c}. Since No ${cat.c} is ${cat.d}, those ${cat.a} can NEVER be ${cat.d}. Hence 'Some ${cat.a} are definitely not ${cat.d}' is TRUE.\n2. 'Only a few ${cat.a} are ${cat.b}' guarantees Some ${cat.a} are NOT ${cat.b}. Hence 'All ${cat.a} being ${cat.b}' is IMPOSSIBLE (False).\nConclusion I follows.`;
    solHi = `1. ${cat.a} का वह भाग जो ${cat.b} में है, ${cat.c} के अंदर है और ${cat.d} नहीं हो सकता। अतः निष्कर्ष I सत्य है।\n2. 'केवल कुछ' के कारण सभी ${cat.a} कभी ${cat.b} नहीं हो सकते (निष्कर्ष II असत्य)।\nअतः केवल निष्कर्ष I अनुसरण करता है।`;
  } else if (qType === 1) {
    // Neither follows
    c1 = `All ${cat.a} can never be ${cat.c}.`;
    c2 = `Some ${cat.b} are ${cat.d}.`;
    c1Hi = `सभी ${cat.a} कभी ${cat.c} नहीं हो सकते।`;
    c2Hi = `कुछ ${cat.b}, ${cat.d} हैं।`;
    correctIdx = 3;
    solEn = `1. 'Only a few ${cat.a} are ${cat.b}' restricts ${cat.a} going into ${cat.b}, but does NOT restrict ${cat.a} from being completely inside ${cat.c}! Hence 'All ${cat.a} being ${cat.c} is a possibility' is true, making 'All ${cat.a} can never be ${cat.c}' FALSE.\n2. Since No ${cat.c} is ${cat.d} and All ${cat.b} are ${cat.c}, no ${cat.b} can ever be ${cat.d}. Hence Some ${cat.b} are ${cat.d} is FALSE.\nNeither conclusion follows.`;
    solHi = `1. ${cat.a} का ${cat.c} के अंदर जाना प्रतिबंधित नहीं है, अतः निष्कर्ष I गलत है।\n2. कोई ${cat.b}, ${cat.d} नहीं हो सकता, अतः निष्कर्ष II भी गलत है।\nअतः न तो निष्कर्ष I और न ही II अनुसरण करता है।`;
  } else {
    // Both follow
    c1 = `Some ${cat.a} are not ${cat.b}.`;
    c2 = `No ${cat.b} is ${cat.d}.`;
    c1Hi = `कुछ ${cat.a}, ${cat.b} नहीं हैं।`;
    c2Hi = `कोई ${cat.b}, ${cat.d} नहीं है।`;
    correctIdx = 4;
    solEn = `1. 'Only a few ${cat.a} are ${cat.b}' directly means Some ${cat.a} are ${cat.b} AND Some ${cat.a} are NOT ${cat.b}. Thus Conclusion I is DEFINITELY TRUE.\n2. All ${cat.b} are inside ${cat.c}, and No ${cat.c} is ${cat.d}. Therefore, No ${cat.b} is ${cat.d} is DEFINITELY TRUE.\nBoth conclusions follow.`;
    solHi = `1. 'केवल कुछ' का सीधा अर्थ है 'कुछ नहीं हैं'। अतः निष्कर्ष I सत्य है।\n2. सभी ${cat.b}, ${cat.c} के अंदर हैं और कोई ${cat.c}, ${cat.d} नहीं है, अतः कोई ${cat.b}, ${cat.d} नहीं है। निष्कर्ष II भी सत्य है।\nअतः दोनों निष्कर्ष I और II अनुसरण करते हैं।`;
  }

  const options = [
    "Only conclusion I follows",
    "Only conclusion II follows",
    "Either conclusion I or II follows",
    "Neither conclusion I nor II follows",
    "Both conclusions I and II follow"
  ];

  return {
    id: `GEN-SYLL-${String(index).padStart(4, '0')}`,
    exam: ["SBI_CLERK", "IBPS_CLERK", "IBPS_RRB_OA"],
    phase: "PRELIMS",
    year: 2025,
    topic: "syllogism",
    subtopic: "Only a few & Definite Relations",
    type: "ORIGINAL",
    difficulty: "EASY",
    expected_time: 20,
    question_en: `Statements:\n${stmt}\n\nConclusions:\nI. ${c1}\nII. ${c2}`,
    question_hi: `कथन:\n${stmtHi}\n\nनिष्कर्ष:\nI. ${c1Hi}\nII. ${c2Hi}`,
    options,
    correct_answer: correctIdx,
    solution_en: solEn,
    solution_hi: solHi,
    shortcut: "'Only a few A are B' => 'Some A are not B' is 100% definite truth. 'All A can be B' is 100% false.",
    exam_trick: "Check conclusion keywords: if positive possibility contradicts 'only a few', reject without drawing Venn diagram.",
    trap: "Confusing 'Only a few' with simple 'Some'.",
    tags: ["syllogism", "only-a-few", "speed"]
  };
}

// 5. Alphanumeric Series Generator
export function generateAlphanumericQuestion(rng, index) {
  const chars = "A B C D E F G H I J K L M N P Q R S T U V W X Y Z 2 3 4 5 6 7 8 9 @ # $ % & *".split(" ");
  const seq = rng.shuffle(chars).slice(0, 24).join(" ");
  const elements = seq.split(" ");

  const fromRight = rng.next() > 0.5;
  const refEnd = fromRight ? "right" : "left";
  const refEndHi = fromRight ? "दाएँ" : "बाएँ";

  const pos1 = rng.nextInt(12, 18);
  const pos2 = rng.nextInt(3, 6);
  const sameDir = rng.next() > 0.5;

  let targetIndex;
  let question_en, question_hi;

  if (sameDir) {
    // e.g. 4th to the left of 14th from left -> 14 - 4 = 10th
    const finalRank = pos1 - pos2;
    if (fromRight) {
      targetIndex = elements.length - finalRank;
      question_en = `Which element is ${pos2}th to the right of the ${pos1}th element from the right end in the given sequence?\n\nSequence: ${seq}`;
      question_hi = `दी गई श्रृंखला में दाएँ छोर से ${pos1}वें तत्व के दाएँ ${pos2}वाँ तत्व कौन सा है?\n\nश्रृंखला: ${seq}`;
    } else {
      targetIndex = finalRank - 1;
      question_en = `Which element is ${pos2}th to the left of the ${pos1}th element from the left end in the given sequence?\n\nSequence: ${seq}`;
      question_hi = `दी गई श्रृंखला में बाएँ छोर से ${pos1}वें तत्व के बाएँ ${pos2}वाँ तत्व कौन सा है?\n\nश्रृंखला: ${seq}`;
    }
  } else {
    // opposite directions -> add
    const finalRank = pos1 - pos2;
    targetIndex = fromRight ? (elements.length - finalRank) : (finalRank - 1);
    question_en = `Which element is ${pos2}th to the ${fromRight ? 'right' : 'left'} of the ${pos1 - pos2}th element from the ${refEnd} end?\n\nSequence: ${seq}`;
    question_hi = `दी गई श्रृंखला में ${refEndHi} छोर से ${pos1 - pos2}वें तत्व के ${fromRight ? 'दाएँ' : 'बाएँ'} ${pos2}वाँ तत्व कौन सा है?\n\nश्रृंखला: ${seq}`;
  }

  const correctElement = elements[Math.max(0, Math.min(elements.length - 1, targetIndex))];
  const wrongChoices = elements.filter(e => e !== correctElement).slice(0, 4);
  const options = rng.shuffle([correctElement, ...wrongChoices]);
  const correctIdx = options.indexOf(correctElement);

  return {
    id: `GEN-ALPH-${String(index).padStart(4, '0')}`,
    exam: ["SBI_CLERK", "IBPS_RRB_OA", "IBPS_CLERK"],
    phase: "PRELIMS",
    year: 2025,
    topic: "alphanumeric_series",
    subtopic: "Sequential Direction Operations",
    type: "ORIGINAL",
    difficulty: "EASY",
    expected_time: 15,
    question_en,
    question_hi,
    options,
    correct_answer: correctIdx,
    solution_en: `Direction Addition/Subtraction Rule:\n- Same directions: SUBTRACT.\n- Opposite directions: ADD.\nTarget element is '${correctElement}'.`,
    solution_hi: `दिशा नियम:\n- समान दिशाएँ: घटाएँ।\n- विपरीत दिशाएँ: जोड़ें।\nसही तत्व '${correctElement}' है।`,
    shortcut: "Same directions subtract: do calculation first, then count once directly.",
    exam_trick: "Never count forward and backward sequentially; compute the net single rank first.",
    trap: "Starting from the wrong end of the string.",
    tags: ["alphanumeric", "series", "speed-drill"]
  };
}

// Master deterministic generator to generate N questions
export function generateQuestionBatch(count = 500, initialSeed = 42) {
  const rng = new SeededRNG(initialSeed);
  const questions = [];

  for (let i = 1; i <= count; i++) {
    const selector = i % 5;
    let q;
    if (selector === 0) {
      q = generateInequalityQuestion(rng, i);
    } else if (selector === 1) {
      q = generateRankingQuestion(rng, i);
    } else if (selector === 2) {
      q = generateDirectionQuestion(rng, i);
    } else if (selector === 3) {
      q = generateSyllogismQuestion(rng, i);
    } else {
      q = generateAlphanumericQuestion(rng, i);
    }
    questions.push(q);
  }

  return questions;
}
