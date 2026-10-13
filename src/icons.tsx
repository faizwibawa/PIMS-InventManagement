import type { CSSProperties, HTMLAttributes } from "react"

type IconNode = [string, Record<string, string | number>]
type IconData = { name: string size: number node: IconNode[] }
type IconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: number
  strokeWidth?: number
}

const iconData = {
  AlertTriangle: {
    name: "triangle-alert",
    size: 24,
    node: [
      [
        "path",
        {
          d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
          key: "wmoenq",
        },
      ],
      [
        "path",
        {
          d: "M12 9v4",
          key: "juzpu7",
        },
      ],
      [
        "path",
        {
          d: "M12 17h.01",
          key: "p32p05",
        },
      ],
    ],
    aliases: ["alert-triangle"],
  },
  AlertCircle: {
    name: "circle-alert",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          key: "1mglay",
        },
      ],
      [
        "line",
        {
          x1: "12",
          x2: "12",
          y1: "8",
          y2: "12",
          key: "1pkeuh",
        },
      ],
      [
        "line",
        {
          x1: "12",
          x2: "12.01",
          y1: "16",
          y2: "16",
          key: "4dfq90",
        },
      ],
    ],
    aliases: ["alert-circle"],
  },
  ArrowLeft: {
    name: "arrow-left",
    size: 24,
    node: [
      [
        "path",
        {
          d: "m12 19-7-7 7-7",
          key: "1l729n",
        },
      ],
      [
        "path",
        {
          d: "M19 12H5",
          key: "x3x0zl",
        },
      ],
    ],
  },
  ArrowRight: {
    name: "arrow-right",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M5 12h14",
          key: "1ays0h",
        },
      ],
      [
        "path",
        {
          d: "m12 5 7 7-7 7",
          key: "xquz4c",
        },
      ],
    ],
  },
  Bell: {
    name: "bell",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M10.268 21a2 2 0 0 0 3.464 0",
          key: "vwvbt9",
        },
      ],
      [
        "path",
        {
          d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
          key: "11g9vi",
        },
      ],
    ],
  },
  BookOpen: {
    name: "book-open",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M12 5v16",
          key: "1f6ucr",
        },
      ],
      [
        "path",
        {
          d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
          key: "1fyvmf",
        },
      ],
    ],
  },
  Box: {
    name: "box",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
          key: "hh9hay",
        },
      ],
      [
        "path",
        {
          d: "m3.3 7 8.7 5 8.7-5",
          key: "g66t2b",
        },
      ],
      [
        "path",
        {
          d: "M12 22V12",
          key: "d0xqtd",
        },
      ],
    ],
  },
  Check: {
    name: "check",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M20 6 9 17l-5-5",
          key: "1gmf2c",
        },
      ],
    ],
  },
  CheckCircle2: {
    name: "circle-check",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          key: "1mglay",
        },
      ],
      [
        "path",
        {
          d: "m16 9-5.5 5.5L8 12",
          key: "xofnsj",
        },
      ],
    ],
    aliases: ["check-circle-2"],
  },
  ChevronDown: {
    name: "chevron-down",
    size: 24,
    node: [
      [
        "path",
        {
          d: "m6 9 6 6 6-6",
          key: "qrunsl",
        },
      ],
    ],
  },
  ChevronRight: {
    name: "chevron-right",
    size: 24,
    node: [
      [
        "path",
        {
          d: "m9 18 6-6-6-6",
          key: "mthhwq",
        },
      ],
    ],
  },
  CircleHelp: {
    name: "circle-question-mark",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          key: "1mglay",
        },
      ],
      [
        "path",
        {
          d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
          key: "1u773s",
        },
      ],
      [
        "path",
        {
          d: "M12 17h.01",
          key: "p32p05",
        },
      ],
    ],
    aliases: ["help-circle", "circle-help"],
  },
  ClipboardCheck: {
    name: "clipboard-check",
    size: 24,
    node: [
      [
        "rect",
        {
          width: "8",
          height: "4",
          x: "8",
          y: "2",
          rx: "1",
          ry: "1",
          key: "tgr4d6",
        },
      ],
      [
        "path",
        {
          d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
          key: "116196",
        },
      ],
      [
        "path",
        {
          d: "m9 14 2 2 4-4",
          key: "df797q",
        },
      ],
    ],
  },
  Clock3: {
    name: "clock-3",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          key: "1mglay",
        },
      ],
      [
        "path",
        {
          d: "M12 6v6h4",
          key: "135r8i",
        },
      ],
    ],
  },
  Eye: {
    name: "eye",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
          key: "1nclc0",
        },
      ],
      [
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "3",
          key: "1v7zrd",
        },
      ],
    ],
  },
  EyeOff: {
    name: "eye-off",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
          key: "ct8e1f",
        },
      ],
      [
        "path",
        {
          d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
          key: "151rxh",
        },
      ],
      [
        "path",
        {
          d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
          key: "13bj9a",
        },
      ],
      [
        "path",
        {
          d: "m2 2 20 20",
          key: "1ooewy",
        },
      ],
    ],
  },
  Folder: {
    name: "folder",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
          key: "1kt360",
        },
      ],
    ],
  },
  Home: {
    name: "house",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
          key: "5wwlr5",
        },
      ],
      [
        "path",
        {
          d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
          key: "r6nss1",
        },
      ],
    ],
    aliases: ["home"],
  },
  Layers3: {
    name: "layers",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
          key: "zw3jo",
        },
      ],
      [
        "path",
        {
          d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
          key: "1wduqc",
        },
      ],
      [
        "path",
        {
          d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
          key: "kqbvx6",
        },
      ],
    ],
    aliases: ["layers-3"],
  },
  LockKeyhole: {
    name: "lock-keyhole",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "16",
          r: "1",
          key: "1au0dj",
        },
      ],
      [
        "rect",
        {
          x: "3",
          y: "10",
          width: "18",
          height: "12",
          rx: "2",
          key: "6s8ecr",
        },
      ],
      [
        "path",
        {
          d: "M7 10V7a5 5 0 0 1 10 0v3",
          key: "1pqi11",
        },
      ],
    ],
  },
  Mail: {
    name: "mail",
    size: 24,
    node: [
      [
        "path",
        {
          d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
          key: "132q7q",
        },
      ],
      [
        "rect",
        {
          x: "2",
          y: "4",
          width: "20",
          height: "16",
          rx: "2",
          key: "izxlao",
        },
      ],
    ],
  },
  MapPin: {
    name: "map-pin",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
          key: "1r0f0z",
        },
      ],
      [
        "circle",
        {
          cx: "12",
          cy: "10",
          r: "3",
          key: "ilqhr7",
        },
      ],
    ],
  },
  PackageCheck: {
    name: "package-check",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M12 22V12",
          key: "d0xqtd",
        },
      ],
      [
        "path",
        {
          d: "m16 17 2 2 4-4",
          key: "uh5qu3",
        },
      ],
      [
        "path",
        {
          d: "M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753",
          key: "kpkbpo",
        },
      ],
      [
        "path",
        {
          d: "M3.29 7 12 12l8.71-5",
          key: "19ckod",
        },
      ],
      [
        "path",
        {
          d: "m7.5 4.27 8.997 5.148",
          key: "9yrvtv",
        },
      ],
    ],
  },
  Plus: {
    name: "plus",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M5 12h14",
          key: "1ays0h",
        },
      ],
      [
        "path",
        {
          d: "M12 5v14",
          key: "s699le",
        },
      ],
    ],
  },
  RefreshCw: {
    name: "refresh-cw",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
          key: "v9h5vc",
        },
      ],
      [
        "path",
        {
          d: "M21 3v5h-5",
          key: "1q7to0",
        },
      ],
      [
        "path",
        {
          d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
          key: "3uifl3",
        },
      ],
      [
        "path",
        {
          d: "M8 16H3v5",
          key: "1cv678",
        },
      ],
    ],
  },
  ScanLine: {
    name: "scan-line",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M3 7V5a2 2 0 0 1 2-2h2",
          key: "aa7l1z",
        },
      ],
      [
        "path",
        {
          d: "M17 3h2a2 2 0 0 1 2 2v2",
          key: "4qcy5o",
        },
      ],
      [
        "path",
        {
          d: "M21 17v2a2 2 0 0 1-2 2h-2",
          key: "6vwrx8",
        },
      ],
      [
        "path",
        {
          d: "M7 21H5a2 2 0 0 1-2-2v-2",
          key: "ioqczr",
        },
      ],
      [
        "path",
        {
          d: "M7 12h10",
          key: "b7w52i",
        },
      ],
    ],
  },
  Search: {
    name: "search",
    size: 24,
    node: [
      [
        "path",
        {
          d: "m21 21-4.34-4.34",
          key: "14j7rj",
        },
      ],
      [
        "circle",
        {
          cx: "11",
          cy: "11",
          r: "8",
          key: "4ej97u",
        },
      ],
    ],
  },
  Sparkles: {
    name: "sparkles",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
          key: "1s2grr",
        },
      ],
      [
        "path",
        {
          d: "M20 2v4",
          key: "1rf3ol",
        },
      ],
      [
        "path",
        {
          d: "M22 4h-4",
          key: "gwowj6",
        },
      ],
      [
        "circle",
        {
          cx: "4",
          cy: "20",
          r: "2",
          key: "6kqj1y",
        },
      ],
    ],
    aliases: ["stars"],
  },
  Trash2: {
    name: "trash",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M10 11v6",
          key: "nco0om",
        },
      ],
      [
        "path",
        {
          d: "M14 11v6",
          key: "outv1u",
        },
      ],
      [
        "path",
        {
          d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
          key: "miytrc",
        },
      ],
      [
        "path",
        {
          d: "M3 6h18",
          key: "d0wm0j",
        },
      ],
      [
        "path",
        {
          d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
          key: "e791ji",
        },
      ],
    ],
    aliases: ["trash-2"],
  },
  User: {
    name: "user",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
          key: "975kel",
        },
      ],
      [
        "circle",
        {
          cx: "12",
          cy: "7",
          r: "4",
          key: "17ys0d",
        },
      ],
    ],
  },
  UserRound: {
    name: "user-round",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "8",
          r: "5",
          key: "1hypcn",
        },
      ],
      [
        "path",
        {
          d: "M20 21a8 8 0 0 0-16 0",
          key: "rfgkzh",
        },
      ],
    ],
    aliases: ["user-2"],
  },
  WalletCards: {
    name: "wallet-cards",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21",
          key: "1vwh6y",
        },
      ],
      [
        "path",
        {
          d: "M3 7h18",
          key: "1uiuf2",
        },
      ],
      [
        "rect",
        {
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2",
          key: "h1oib",
        },
      ],
    ],
  },
  X: {
    name: "x",
    size: 24,
    node: [
      [
        "path",
        {
          d: "M18 6 6 18",
          key: "1bl5f8",
        },
      ],
      [
        "path",
        {
          d: "m6 6 12 12",
          key: "d8bk6v",
        },
      ],
    ],
  },
  XCircle: {
    name: "circle-x",
    size: 24,
    node: [
      [
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          key: "1mglay",
        },
      ],
      [
        "path",
        {
          d: "m15 9-6 6",
          key: "1uzhvr",
        },
      ],
      [
        "path",
        {
          d: "m9 9 6 6",
          key: "z0biqf",
        },
      ],
    ],
    aliases: ["x-circle"],
  },
} as Record<string, IconData>

const attributeName = (name: string) =>
  name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const escapeAttribute = (value: string | number) =>
  String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;")

const iconUri = (data: IconData, strokeWidth: number) => {
  const nodes = data.node
    .map(([tag, attributes]) => {
      const serialized = Object.entries(attributes)
        .filter(([name]) => name !== "key")
        .map(
          ([name, value]) =>
            `${attributeName(name)}="${escapeAttribute(value)}"`,
        )
        .join(" ")
      return `<${tag} ${serialized}/>`
    })
    .join("")
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${nodes}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function LucideMask({
  name,
  size = 24,
  strokeWidth = 1.75,
  className = "",
  style,
  ...props
}: IconProps & { name: string }) {
  const mask = iconUri(iconData[name], strokeWidth)
  const maskStyle: CSSProperties = {
    width: size,
    height: size,
    display: "inline-block",
    flex: "none",
    backgroundColor: "currentColor",
    maskImage: mask,
    WebkitMaskImage: mask,
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    ...style,
  }
  return (
    <span
      aria-hidden="true"
      className={`lucide-icon ${className}`.trim()}
      style={maskStyle}
      {...props}
    />
  )
}

export const AlertTriangle = (props: IconProps) => (
  <LucideMask name="AlertTriangle" {...props} />
)

export const AlertCircle = (props: IconProps) => (
  <LucideMask name="AlertCircle" {...props} />
)

export const ArrowLeft = (props: IconProps) => (
  <LucideMask name="ArrowLeft" {...props} />
)

export const ArrowRight = (props: IconProps) => (
  <LucideMask name="ArrowRight" {...props} />
)

export const Bell = (props: IconProps) => <LucideMask name="Bell" {...props} />

export const BookOpen = (props: IconProps) => (
  <LucideMask name="BookOpen" {...props} />
)

export const Box = (props: IconProps) => <LucideMask name="Box" {...props} />

export const Check = (props: IconProps) => (
  <LucideMask name="Check" {...props} />
)

export const CheckCircle2 = (props: IconProps) => (
  <LucideMask name="CheckCircle2" {...props} />
)

export const ChevronDown = (props: IconProps) => (
  <LucideMask name="ChevronDown" {...props} />
)

export const ChevronRight = (props: IconProps) => (
  <LucideMask name="ChevronRight" {...props} />
)

export const CircleHelp = (props: IconProps) => (
  <LucideMask name="CircleHelp" {...props} />
)

export const ClipboardCheck = (props: IconProps) => (
  <LucideMask name="ClipboardCheck" {...props} />
)

export const Clock3 = (props: IconProps) => (
  <LucideMask name="Clock3" {...props} />
)

export const Eye = (props: IconProps) => <LucideMask name="Eye" {...props} />

export const EyeOff = (props: IconProps) => (
  <LucideMask name="EyeOff" {...props} />
)

export const Folder = (props: IconProps) => (
  <LucideMask name="Folder" {...props} />
)

export const Home = (props: IconProps) => <LucideMask name="Home" {...props} />

export const Layers3 = (props: IconProps) => (
  <LucideMask name="Layers3" {...props} />
)

export const LockKeyhole = (props: IconProps) => (
  <LucideMask name="LockKeyhole" {...props} />
)

export const Mail = (props: IconProps) => <LucideMask name="Mail" {...props} />

export const MapPin = (props: IconProps) => (
  <LucideMask name="MapPin" {...props} />
)

export const PackageCheck = (props: IconProps) => (
  <LucideMask name="PackageCheck" {...props} />
)

export const Plus = (props: IconProps) => <LucideMask name="Plus" {...props} />

export const RefreshCw = (props: IconProps) => (
  <LucideMask name="RefreshCw" {...props} />
)

export const ScanLine = (props: IconProps) => (
  <LucideMask name="ScanLine" {...props} />
)

export const Search = (props: IconProps) => (
  <LucideMask name="Search" {...props} />
)

export const Sparkles = (props: IconProps) => (
  <LucideMask name="Sparkles" {...props} />
)

export const Trash2 = (props: IconProps) => (
  <LucideMask name="Trash2" {...props} />
)

export const User = (props: IconProps) => <LucideMask name="User" {...props} />

export const UserRound = (props: IconProps) => (
  <LucideMask name="UserRound" {...props} />
)

export const WalletCards = (props: IconProps) => (
  <LucideMask name="WalletCards" {...props} />
)

export const X = (props: IconProps) => <LucideMask name="X" {...props} />

export const XCircle = (props: IconProps) => (
  <LucideMask name="XCircle" {...props} />
)
