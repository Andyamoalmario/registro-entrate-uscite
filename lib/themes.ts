export interface ThemeTokens {
  ink: string;
  inkSoft: string;
  paper: string;
  paperRaised: string;
  rule: string;
  ruleSoft: string;
  accentSoft: string;
  income: string;
  incomeSoft: string;
  incomeBright: string;
  expense: string;
  expenseSoft: string;
  expenseBright: string;
  invest: string;
  investSoft: string;
  investBright: string;
}

export interface Theme {
  id: string;
  label: string;
  swatch: string;
  tokens: ThemeTokens;
}

export const THEMES: Theme[] = [
  {
    id: "azzurro",
    label: "Azzurro",
    swatch: "#355A70",
    tokens: {
      ink: "#355A70",
      inkSoft: "#4E6C7D",
      paper: "#F5FAFC",
      paperRaised: "#FFFFFF",
      rule: "#D9EAF1",
      ruleSoft: "#EAF4F8",
      accentSoft: "#E1F0F7",
      income: "#5FA97F",
      incomeSoft: "#DFF3E7",
      incomeBright: "#8FD1AC",
      expense: "#D9789A",
      expenseSoft: "#FBE3E9",
      expenseBright: "#F0A8C0",
      invest: "#D1A63C",
      investSoft: "#FBF0D2",
      investBright: "#F5DD8A",
    },
  },
  {
    id: "salvia",
    label: "Verde salvia",
    swatch: "#4C6B54",
    tokens: {
      ink: "#3F5B45",
      inkSoft: "#587465",
      paper: "#F6FAF6",
      paperRaised: "#FFFFFF",
      rule: "#DCEBDF",
      ruleSoft: "#EAF4EC",
      accentSoft: "#E2F0E5",
      income: "#4C8465",
      incomeSoft: "#DEF0E3",
      incomeBright: "#8FD1AC",
      expense: "#C97A63",
      expenseSoft: "#F5E2DC",
      expenseBright: "#E8A98E",
      invest: "#C0A23C",
      investSoft: "#F4EDD1",
      investBright: "#EBD98A",
    },
  },
  {
    id: "cipria",
    label: "Rosa cipria",
    swatch: "#8A5D6B",
    tokens: {
      ink: "#7A4D5A",
      inkSoft: "#8A5D6B",
      paper: "#FBF6F7",
      paperRaised: "#FFFFFF",
      rule: "#F0DEE3",
      ruleSoft: "#F7EBEE",
      accentSoft: "#F5E4E9",
      income: "#5FA97F",
      incomeSoft: "#DFF3E7",
      incomeBright: "#8FD1AC",
      expense: "#C4607E",
      expenseSoft: "#F6DEE6",
      expenseBright: "#E8A0B7",
      invest: "#C99A45",
      investSoft: "#F4EAD2",
      investBright: "#EAD08F",
    },
  },
  {
    id: "grafite",
    label: "Grafite",
    swatch: "#3A3F47",
    tokens: {
      ink: "#2E333A",
      inkSoft: "#4A4F57",
      paper: "#F4F5F6",
      paperRaised: "#FFFFFF",
      rule: "#DDE1E6",
      ruleSoft: "#ECEEF0",
      accentSoft: "#E4E7EA",
      income: "#3F8A5C",
      incomeSoft: "#DEEFE3",
      incomeBright: "#8FD1AC",
      expense: "#B8433A",
      expenseSoft: "#F2DEDC",
      expenseBright: "#E29A93",
      invest: "#9A7B2E",
      investSoft: "#EDE6D0",
      investBright: "#D9C27E",
    },
  },
  {
    id: "navy",
    label: "Blu navy",
    swatch: "#1B2E4A",
    tokens: {
      ink: "#182A44",
      inkSoft: "#3F506A",
      paper: "#F4F6FA",
      paperRaised: "#FFFFFF",
      rule: "#DBE2EE",
      ruleSoft: "#EAEEF5",
      accentSoft: "#E1E8F4",
      income: "#3D7A5C",
      incomeSoft: "#DDEDE4",
      incomeBright: "#8FD1AC",
      expense: "#A83E3E",
      expenseSoft: "#F0DBDB",
      expenseBright: "#DE9797",
      invest: "#B8933C",
      investSoft: "#F0E7CC",
      investBright: "#E3CD8E",
    },
  },
  {
    id: "bosco",
    label: "Verde bosco",
    swatch: "#2F4A38",
    tokens: {
      ink: "#28402F",
      inkSoft: "#4C6357",
      paper: "#F5F7F4",
      paperRaised: "#FFFFFF",
      rule: "#DCE5DD",
      ruleSoft: "#EBF0EA",
      accentSoft: "#E3ECE4",
      income: "#4C8B5A",
      incomeSoft: "#DFEEE2",
      incomeBright: "#93D1A2",
      expense: "#9C5A3C",
      expenseSoft: "#EEE0D5",
      expenseBright: "#D9A280",
      invest: "#A68A3A",
      investSoft: "#EEE7D0",
      investBright: "#D9C285",
    },
  },
];
