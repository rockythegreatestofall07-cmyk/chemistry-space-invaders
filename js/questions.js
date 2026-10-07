/* ==========================================================================
   Expanded & Challenging Periodic Table Question Bank
   Includes 40+ questions across 4 levels.
   Dynamically sampled & shuffled every game session!
   ========================================================================== */

export const LEVEL_POOLS = [
  {
    levelNumber: 1,
    title: "LEVEL 1: SYMBOLS & LATIN ORIGINS",
    subtitle: "Test your knowledge of elemental symbols & classical names!",
    pool: [
      {
        question: "What element does the symbol 'W' represent on the Periodic Table?",
        options: ["Tungsten", "Wolframite", "Water"],
        correctIndex: 0,
        explanation: "'W' stands for Tungsten, derived from its German name 'Wolfram'!"
      },
      {
        question: "What is the chemical symbol for Lead, derived from Latin 'Plumbum'?",
        options: ["Pb", "Ld", "Pl"],
        correctIndex: 0,
        explanation: "Lead's symbol 'Pb' comes from the Latin word 'Plumbum', which is also the origin of 'plumbing'!"
      },
      {
        question: "Which element symbol 'K' comes from the Latin word 'Kalium'?",
        options: ["Potassium", "Krypton", "Kalium oxide"],
        correctIndex: 0,
        explanation: "Potassium has the symbol 'K' from its Neo-Latin name Kalium!"
      },
      {
        question: "What element does the chemical symbol 'Sn' stand for?",
        options: ["Tin", "Strontium", "Sodium"],
        correctIndex: 0,
        explanation: "'Sn' comes from 'Stannum', the Latin word for Tin!"
      },
      {
        question: "What is the symbol for Mercury, element #80 on the Periodic Table?",
        options: ["Hg", "Me", "Mc"],
        correctIndex: 0,
        explanation: "'Hg' stands for 'Hydrargyrum', meaning 'liquid silver' in Greek!"
      },
      {
        question: "What element does the symbol 'Fe' represent?",
        options: ["Iron", "Fluorine", "Fermium"],
        correctIndex: 0,
        explanation: "'Fe' comes from 'Ferrum', the classical Latin word for Iron!"
      },
      {
        question: "What is the chemical symbol for Gold on the Periodic Table?",
        options: ["Au", "Go", "Ag"],
        correctIndex: 0,
        explanation: "'Au' comes from 'Aurum', Latin for 'shining dawn'!"
      },
      {
        question: "What is the chemical symbol for Sodium?",
        options: ["Na", "So", "Sm"],
        correctIndex: 0,
        explanation: "'Na' comes from 'Natrium', the classical Latin name for sodium carbonate!"
      },
      {
        question: "What element symbol 'Ag' is derived from the Latin 'Argentum'?",
        options: ["Silver", "Argon", "Actinium"],
        correctIndex: 0,
        explanation: "'Ag' stands for Silver, from the Latin word 'Argentum'!"
      },
      {
        question: "What is the chemical symbol for Copper, named after the island of Cyprus?",
        options: ["Cu", "Co", "Cp"],
        correctIndex: 0,
        explanation: "'Cu' comes from 'Cuprum', ancient Latin for metal from the island of Cyprus!"
      }
    ]
  },
  {
    levelNumber: 2,
    title: "LEVEL 2: PERIODIC TRENDS & GROUPS",
    subtitle: "Explore electronegativity, electron shells, and families!",
    pool: [
      {
        question: "Which element on the Periodic Table is the MOST electronegative?",
        options: ["Fluorine", "Oxygen", "Chlorine"],
        correctIndex: 0,
        explanation: "Fluorine has the highest electronegativity rating (4.0 on the Pauling scale) of all elements!"
      },
      {
        question: "How many valence electrons do full Noble Gases (Group 18) possess, except Helium?",
        options: ["8 Valence Electrons", "2 Valence Electrons", "18 Valence Electrons"],
        correctIndex: 0,
        explanation: "Group 18 noble gases have 8 valence electrons, forming a completely stable octet!"
      },
      {
        question: "Elements along the staircase dividing metals and non-metals are called what?",
        options: ["Metalloids", "Transition Metals", "Halogens"],
        correctIndex: 0,
        explanation: "Metalloids (like Silicon & Germanium) exhibit properties of both metals and non-metals!"
      },
      {
        question: "Besides Mercury, which non-metal element is a LIQUID at room temperature?",
        options: ["Bromine (Br)", "Chlorine (Cl)", "Iodine (I)"],
        correctIndex: 0,
        explanation: "Bromine (Br) and Mercury (Hg) are the ONLY two elements on the Periodic Table that are liquid at room temp!"
      },
      {
        question: "What happens to atomic radius as you move from LEFT to RIGHT across a period?",
        options: ["Decreases", "Increases", "Stays unchanged"],
        correctIndex: 0,
        explanation: "Atomic radius decreases left-to-right because increasing nuclear charge pulls electrons closer!"
      },
      {
        question: "Group 1 elements (Alkali Metals) react violently with water to release which gas?",
        options: ["Hydrogen gas", "Oxygen gas", "Nitrogen gas"],
        correctIndex: 0,
        explanation: "Alkali metals react with H₂O to form metal hydroxides and explosive Hydrogen gas!"
      },
      {
        question: "What group do Fluorine, Chlorine, Bromine, and Iodine belong to?",
        options: ["Halogens (Group 17)", "Alkali Metals", "Noble Gases"],
        correctIndex: 0,
        explanation: "Group 17 elements are Halogens, highly reactive non-metals with 7 valence electrons!"
      },
      {
        question: "Which block of elements occupies Groups 3 to 12 in the middle of the Periodic Table?",
        options: ["Transition Metals", "Lanthanides", "Actinides"],
        correctIndex: 0,
        explanation: "Transition metals occupy the d-block and often form colorful chemical compounds!"
      },
      {
        question: "Noble gases are chemically unreactive. What term describes this property?",
        options: ["Inert", "Corrosive", "Radioactive"],
        correctIndex: 0,
        explanation: "'Inert' means chemically inactive due to full outer electron shells!"
      },
      {
        question: "Ionization energy generally INCREASES in which direction on the Periodic Table?",
        options: ["Up and to the Right", "Down and to the Left", "Straight Down"],
        correctIndex: 0,
        explanation: "Ionization energy peaks at the top-right (Fluorine & Helium) where atoms hold electrons tightly!"
      }
    ]
  },
  {
    levelNumber: 3,
    title: "LEVEL 3: ATOMIC STRUCTURE & ISOTOPES",
    subtitle: "Master atomic numbers, isotopes, and nuclear structure!",
    pool: [
      {
        question: "Which heavy element with atomic number 92 is famous for nuclear fission energy?",
        options: ["Uranium (U)", "Plutonium (Pu)", "Radium (Ra)"],
        correctIndex: 0,
        explanation: "Uranium (element 92) is used as fuel in nuclear power plants!"
      },
      {
        question: "Which radioactive isotope of Carbon is used by scientists for archaeological dating?",
        options: ["Carbon-14", "Carbon-12", "Carbon-16"],
        correctIndex: 0,
        explanation: "Carbon-14 has a half-life of 5,730 years and is used to date ancient organic artifacts!"
      },
      {
        question: "Which metallic element on the Periodic Table has the HIGHEST melting point (3422°C)?",
        options: ["Tungsten (W)", "Titanium (Ti)", "Iron (Fe)"],
        correctIndex: 0,
        explanation: "Tungsten has the highest melting point of all pure metals, used in traditional lightbulb filaments!"
      },
      {
        question: "Atoms of the same element with different numbers of NEUTRONS are called what?",
        options: ["Isotopes", "Ions", "Allotropes"],
        correctIndex: 0,
        explanation: "Isotopes have the same atomic number (protons) but different mass numbers (neutrons)!"
      },
      {
        question: "What is the atomic number of Carbon, the fundamental element of organic chemistry?",
        options: ["Atomic Number 6", "Atomic Number 12", "Atomic Number 14"],
        correctIndex: 0,
        explanation: "Carbon has atomic number 6, meaning every carbon atom has 6 protons!"
      },
      {
        question: "Which isotope of Hydrogen contains 1 proton and 1 neutron in its nucleus?",
        options: ["Deuterium", "Tritium", "Protium"],
        correctIndex: 0,
        explanation: "Deuterium (Heavy Hydrogen) has 1 proton + 1 neutron, making heavy water (D₂O)!"
      },
      {
        question: "What subatomic particle determines an element's identity and atomic number?",
        options: ["Proton", "Electron", "Neutron"],
        correctIndex: 0,
        explanation: "The number of protons in the nucleus defines which element an atom is!"
      },
      {
        question: "Elements with atomic numbers greater than 92 (beyond Uranium) are known as what?",
        options: ["Transuranium elements", "Halogens", "Noble metals"],
        correctIndex: 0,
        explanation: "Transuranium elements are synthetic radioactive elements created in particle accelerators!"
      },
      {
        question: "What charge does a Sodium ion (Na⁺) have after losing 1 electron?",
        options: ["+1 Positive Charge", "-1 Negative Charge", "Neutral Charge"],
        correctIndex: 0,
        explanation: "Losing a negatively charged electron leaves the atom with a net +1 positive charge (cation)!"
      },
      {
        question: "Which synthetic element #118 is currently the heaviest element on the Periodic Table?",
        options: ["Oganesson (Og)", "Tennessine (Ts)", "Moscovium (Mc)"],
        correctIndex: 0,
        explanation: "Oganesson (element 118) was named after Russian nuclear physicist Yuri Oganessian!"
      }
    ]
  },
  {
    levelNumber: 4,
    title: "LEVEL 4: ADVANCED EVERYDAY CHEMISTRY",
    subtitle: "Explore industrial, technological, and medical elements!",
    pool: [
      {
        question: "Which Group 14 semiconductor element is essential for computer microchips & solar cells?",
        options: ["Silicon (Si)", "Germanium (Ge)", "Gallium (Ga)"],
        correctIndex: 0,
        explanation: "Silicon (element 14) is the foundation of modern semiconductor electronics and 'Silicon Valley'!"
      },
      {
        question: "Which lightweight alkali metal (Atomic #3) powers rechargeable EV & smartphone batteries?",
        options: ["Lithium (Li)", "Sodium (Na)", "Cobalt (Co)"],
        correctIndex: 0,
        explanation: "Lithium is the lightest metal and key component of high-density lithium-ion batteries!"
      },
      {
        question: "Which strong, corrosion-resistant metal is widely used in aerospace and medical implants?",
        options: ["Titanium (Ti)", "Aluminum (Al)", "Nickel (Ni)"],
        correctIndex: 0,
        explanation: "Titanium has a very high strength-to-weight ratio and is biocompatible with human bone!"
      },
      {
        question: "Which halogen element is added to drinking water and salt to prevent thyroid goiters?",
        options: ["Iodine (I)", "Chlorine (Cl)", "Fluorine (F)"],
        correctIndex: 0,
        explanation: "Iodine (element 53) is crucial for human thyroid hormone production!"
      },
      {
        question: "Which dense element (Atomic #74) is used in X-ray shielding equipment?",
        options: ["Lead (Pb)", "Barium (Ba)", "Bismuth (Bi)"],
        correctIndex: 0,
        explanation: "Lead absorbs X-ray and gamma radiation due to its dense atomic packing and high atomic number!"
      },
      {
        question: "Which gas makes up approximately 78% of Earth's atmosphere by volume?",
        options: ["Nitrogen (N₂)", "Oxygen (O₂)", "Argon (Ar)"],
        correctIndex: 0,
        explanation: "Nitrogen gas (N₂) dominates Earth's atmosphere, ahead of Oxygen (21%) and Argon (0.93%)!"
      },
      {
        question: "Which noble gas produces the iconic reddish-orange glow in retro neon signs?",
        options: ["Neon (Ne)", "Argon (Ar)", "Krypton (Kr)"],
        correctIndex: 0,
        explanation: "High-voltage electricity passing through low-pressure Neon gas glows brilliant red-orange!"
      },
      {
        question: "Which transition metal catalyst is used in automotive catalytic converters?",
        options: ["Platinum (Pt)", "Silver (Ag)", "Zinc (Zn)"],
        correctIndex: 0,
        explanation: "Platinum, Palladium, and Rhodium catalyze toxic exhaust gases into harmless CO₂ and H₂O!"
      },
      {
        question: "Which element forms both soft charcoal and the hardest natural mineral known, Diamond?",
        options: ["Carbon (C)", "Silicon (Si)", "Boron (B)"],
        correctIndex: 0,
        explanation: "Different crystal structures of pure Carbon produce soft graphite vs ultra-hard diamond!"
      },
      {
        question: "Which liquid element is used in old traditional glass thermometers?",
        options: ["Mercury (Hg)", "Gallium (Ga)", "Bromine (Br)"],
        correctIndex: 0,
        explanation: "Mercury expands uniformly with temperature changes, making it ideal for classical thermometers!"
      }
    ]
  }
];

/**
 * Helper to generate a fresh 5-question game set with randomized question selection
 * and shuffled answer choices [A], [B], [C] for every single playthrough!
 */
export function generateRandomizedGameData() {
  return LEVEL_POOLS.map(levelObj => {
    // 1. Shuffle question pool and pick 5 unique questions
    const shuffledPool = [...levelObj.pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledPool.slice(0, 5);

    // 2. For each question, shuffle answer options and adjust correctIndex
    const processedQuestions = selectedQuestions.map(q => {
      const originalOptions = [...q.options];
      const correctAnswerText = originalOptions[q.correctIndex];

      // Shuffle options array
      const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

      // Add [A], [B], [C] prefixes
      const prefixes = ["A) ", "B) ", "C) "];
      const formattedOptions = shuffledOptions.map((opt, i) => prefixes[i] + opt);

      return {
        question: q.question,
        options: formattedOptions,
        correctIndex: newCorrectIndex,
        explanation: q.explanation
      };
    });

    return {
      levelNumber: levelObj.levelNumber,
      title: levelObj.title,
      subtitle: levelObj.subtitle,
      questions: processedQuestions
    };
  });
}
