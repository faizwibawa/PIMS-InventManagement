import { FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import {
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Eye,
  EyeOff,
  Folder,
  Home,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  Plus,
  RefreshCw,
  ScanLine,
  Search,
  Sparkles,
  Trash2,
  User,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from "./icons"
import { supabase } from "./lib/supabase"
import {
  inventoryApi,
  type InventoryInput,
  type InventoryItem,
  type LocationNode,
} from "./lib/inventory"
import {
  InventoryScreen as LiveInventoryScreen,
  ItemDetailScreen,
  ItemFormScreen,
  LocationsScreen as LiveLocationsScreen,
} from "./inventory/InventoryFeatures"
import {
  notificationsApi,
  quickSetsApi,
  type AppNotification,
  type QuickSet,
  type QuickSetInput,
} from "./lib/quicksets"
import {
  GoodsCheckScreen as LiveGoodsCheckScreen,
  NotificationsScreen as LiveNotificationsScreen,
  QuickSetDetailScreen,
  QuickSetFormScreen,
  QuickSetsScreen as LiveQuickSetsScreen,
} from "./quicksets/QuickSetFeatures"

type Screen = "splash" | "login" | "register" | "dashboard" | "inventory" | "quicksets" | "quickset-detail" | "quickset-form" | "goodscheck" | "notifications" | "locations" | "item-form" | "item-detail" | "profile" | "design"
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive"
type Status = "available" | "unavailable" | "borrowed" | "development"
type ViewState = "data" | "loading" | "empty" | "error"
type UserDisplay = {
  fullName: string
  email: string
  initials: string
}

const laptopPhoto =
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=480"
const keyPhoto =
  "https://images.unsplash.com/photo-1662680448723-1263f36d3ffa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=480"
const umbrellaPhoto =
  "https://images.unsplash.com/photo-1611511450282-af4421e9e05d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=480"

const statusConfig = {
  available: { label: "Tersedia", Icon: CheckCircle2 },
  unavailable: { label: "Tidak Tersedia", Icon: XCircle },
  borrowed: { label: "Dipinjam", Icon: Clock3 },
  development: { label: "In Development", Icon: Sparkles },
}

function Icon({ children, size = 20 }: { children: ReactNode size?: number }) {
  return (
    <span className="icon" style={{ width: size, height: size }}>
      {children}
    </span>
  )
}

function Button({
  children,
  variant = "primary",
  icon,
  iconOnly = false,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: ReactNode
  iconOnly?: boolean
}) {
  return (
    <button
      className={`button button--${variant} ${
        iconOnly ? "button--icon" : ""
      } ${className}`}
      {...props}
    >
      {icon}
      {!iconOnly && <span>{children}</span>}
    </button>
  )
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />
}

function TextInput({
  label,
  helper,
  error,
  leading,
  trailing,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  helper?: string
  error?: string
  leading?: ReactNode
  trailing?: ReactNode
}) {
  const id = props.id || label.toLowerCase().replaceAll(" ", "-")
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <span
        className={`field__control ${error ? "field__control--error" : ""}`}
      >
        {leading && <span className="field__icon">{leading}</span>}
        <input id={id} {...props} />
        {trailing}
      </span>
      {(error || helper) && (
        <span
          className={`field__message ${error ? "field__message--error" : ""}`}
        >
          {error ? <AlertTriangle size={14} /> : <CircleHelp size={14} />}
          {error || helper}
        </span>
      )}
    </label>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const { label, Icon: StatusIcon } = statusConfig[status]
  return (
    <span className={`status status--${status}`}>
      <StatusIcon size={14} strokeWidth={2} />
      {label}
    </span>
  )
}

function ItemCard({
  name,
  category,
  location,
  status,
  image,
  onClick,
}: {
  name: string
  category: string
  location: string
  status: Status
  image?: string
  onClick?: () => void
}) {
  return (
    <button className="item-card" onClick={onClick}>
      {image ? (
        <img className="item-card__image" src={image} alt="" />
      ) : (
        <span className="item-card__image item-card__placeholder">
          <Box size={28} />
        </span>
      )}
      <span className="item-card__body">
        <span className="item-card__topline">
          <strong>{name}</strong>
          <ChevronRight size={18} />
        </span>
        <span className="item-card__category">{category}</span>
        <span className="item-card__location">
          <MapPin size={14} />
          {location}
        </span>
        <StatusBadge status={status} />
      </span>
    </button>
  )
}

const tabs = [
  { label: "Beranda", Icon: Home },
  { label: "Inventaris", Icon: Box },
  { label: "Quick Sets", Icon: Layers3 },
  { label: "Goods Check", Icon: ClipboardCheck },
  { label: "Profil", Icon: UserRound },
]

function BottomTabBar({
  active = "Beranda",
  onSelect,
}: {
  active?: string
  onSelect: (label: string) => void
}) {
  return (
    <nav className="tabbar" aria-label="Navigasi utama">
      {tabs.map(({ label, Icon: TabIcon }) => (
        <button
          className={`tabbar__item ${
            active === label ? "tabbar__item--active" : ""
          }`}
          key={label}
          onClick={() => onSelect(label)}
        >
          <TabIcon size={22} strokeWidth={1.75} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

const navigationMap: Record<string, Screen> = {
  Beranda: "dashboard",
  Inventaris: "inventory",
  "Quick Sets": "quicksets",
  "Goods Check": "goodscheck",
  Profil: "profile",
  Notifikasi: "notifications",
  "Specific Location": "locations",
  "UI Components": "design",
}

function DesktopSidebar({
  active,
  onNavigate,
  user,
}: {
  active: Screen
  onNavigate: (screen: Screen) => void
  user: UserDisplay
}) {
  const primaryItems = [
    { label: "Beranda", screen: "dashboard" as Screen, Icon: Home },
    { label: "Inventaris", screen: "inventory" as Screen, Icon: Box },
    { label: "Quick Sets", screen: "quicksets" as Screen, Icon: Layers3 },
    {
      label: "Goods Check",
      screen: "goodscheck" as Screen,
      Icon: ClipboardCheck,
    },
    { label: "Profil", screen: "profile" as Screen, Icon: UserRound },
  ]
  const secondaryItems = [
    {
      label: "Notifikasi",
      screen: "notifications" as Screen,
      Icon: Bell,
    },
    {
      label: "Specific Location",
      screen: "locations" as Screen,
      Icon: MapPin,
    },
    {
      label: "UI Components",
      screen: "design" as Screen,
      Icon: Sparkles,
    },
  ]

  return (
    <aside className="desktop-sidebar">
      <LogoMark />
      <nav className="sidebar-nav" aria-label="Navigasi desktop">
        <p className="sidebar-label">Menu utama</p>
        {primaryItems.map(({ label, screen, Icon: NavIcon }) => (
          <button
            key={screen}
            className={active === screen ? "active" : ""}
            onClick={() => onNavigate(screen)}
          >
            <NavIcon size={20} strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}
        <p className="sidebar-label sidebar-label--spaced">Lainnya</p>
        {secondaryItems.map(({ label, screen, Icon: NavIcon }) => (
          <button
            key={screen}
            className={active === screen ? "active" : ""}
            onClick={() => onNavigate(screen)}
          >
            <NavIcon size={20} strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="sidebar-profile" onClick={() => onNavigate("profile")}>
        <span className="avatar">{user.initials}</span>
        <span>
          <strong>{user.fullName}</strong>
          <small>Kelola akun</small>
        </span>
        <ChevronRight size={18} />
      </button>
    </aside>
  )
}

function FAB({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="fab"
      icon={<Plus size={24} strokeWidth={2} />}
      iconOnly
      aria-label="Tambah Barang"
      onClick={onClick}
    >
      Tambah Barang
    </Button>
  )
}

function BottomSheet({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="sheet-layer" role="presentation" onMouseDown={onClose}>
      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="bottom-sheet__handle" />
        <div className="section-heading">
          <div>
            <p className="eyebrow">PIMS</p>
            <h2>{title}</h2>
          </div>
          <Button
            variant="ghost"
            icon={<X size={22} />}
            iconOnly
            aria-label="Tutup"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
        {children}
      </section>
    </div>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <div className="toast" role="status">
      <CheckCircle2 size={20} />
      <span>{message}</span>
    </div>
  )
}

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand--compact" : ""}`}>
      <span className="brand__mark">
        <Box size={compact ? 22 : 30} strokeWidth={1.75} />
        <Check size={compact ? 11 : 14} strokeWidth={3} />
      </span>
      {!compact && (
        <span>
          <strong>PIMS</strong>
          <small>Personal Inventory Management System</small>
        </span>
      )}
    </div>
  )
}

const slides = [
  {
    title: "Catat Barang",
    copy: "Simpan semua barang penting dalam satu tempat yang mudah diperbarui.",
    Icon: Box,
    motif: "motif--boxes",
  },
  {
    title: "Ingat Lokasi",
    copy: "Temukan lokasi spesifik barang tanpa membongkar semua tempat penyimpanan.",
    Icon: MapPin,
    motif: "motif--location",
  },
  {
    title: "Cek Sebelum Pergi",
    copy: "Pastikan semua kebutuhan aktivitas sudah siap sebelum berangkat.",
    Icon: ClipboardCheck,
    motif: "motif--check",
  },
]

function SplashScreen({
  onLogin,
  onRegister,
  onDesign,
}: {
  onLogin: () => void
  onRegister: () => void
  onDesign: () => void
}) {
  const [slide, setSlide] = useState(0)
  const touchStart = useRef<number | null>(null)

  const move = (direction: number) =>
    setSlide((current) =>
      Math.max(0, Math.min(slides.length - 1, current + direction)),
    )

  return (
    <main className="screen screen--splash">
      <div className="splash__top">
        <LogoMark compact />
        <Button variant="ghost" className="ds-shortcut" onClick={onDesign}>
          Design System
        </Button>
      </div>
      <div
        className="onboarding"
        onTouchStart={(event) =>
          (touchStart.current = event.touches[0].clientX)
        }
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const distance = event.changedTouches[0].clientX - touchStart.current
          if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1)
          touchStart.current = null
        }}
      >
        <div
          className="onboarding__track"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {slides.map(({ title, copy, Icon: SlideIcon, motif }) => (
            <article className="onboarding__slide" key={title}>
              <div className={`hero-illustration ${motif}`}>
                <span className="hero-illustration__orbit hero-illustration__orbit--one" />
                <span className="hero-illustration__orbit hero-illustration__orbit--two" />
                <span className="hero-illustration__icon">
                  <SlideIcon size={66} strokeWidth={1.5} />
                </span>
                <span className="hero-illustration__chip">
                  <Check size={16} strokeWidth={3} /> Tersimpan
                </span>
              </div>
              <div className="onboarding__copy">
                <p className="eyebrow">Barangmu, lebih teratur</p>
                <h1>{title}</h1>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="splash__footer">
        <div className="carousel-controls">
          <div className="dots" aria-label={`Slide ${slide + 1} dari 3`}>
            {slides.map((item, index) => (
              <button
                key={item.title}
                className={`dot ${index === slide ? "dot--active" : ""}`}
                onClick={() => setSlide(index)}
                aria-label={`Buka ${item.title}`}
              />
            ))}
          </div>
          {slide < 2 && (
            <Button
              variant="ghost"
              icon={<ArrowRight size={20} />}
              iconOnly
              aria-label="Slide berikutnya"
              onClick={() => move(1)}
            >
              Berikutnya
            </Button>
          )}
        </div>
        <Button onClick={onLogin}>Masuk</Button>
        <Button variant="secondary" onClick={onRegister}>
          Daftar
        </Button>
      </div>
    </main>
  )
}

function AuthHeader({
  title,
  copy,
  onBack,
}: {
  title: string
  copy: string
  onBack: () => void
}) {
  return (
    <>
      <div className="auth__nav">
        <Button
          variant="ghost"
          icon={<ArrowLeft size={22} />}
          iconOnly
          aria-label="Kembali"
          onClick={onBack}
        >
          Kembali
        </Button>
        <LogoMark compact />
        <span className="nav-spacer" />
      </div>
      <div className="auth__heading">
        <p className="eyebrow">Selamat datang di PIMS</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </>
  )
}

function LoginScreen({
  onBack,
  onRegister,
  onSuccess,
}: {
  onBack: () => void
  onRegister: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const emailError =
    submitted && !/^\S+@\S+\.\S+$/.test(email)
      ? "Masukkan email yang valid."
      : ""
  const passwordError =
    submitted && password.length < 8 ? "Kata sandi minimal 8 karakter." : ""

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setAuthError("")
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        const wrongCredentials =
          error.status === 400 ||
          error.code === "invalid_credentials" ||
          error.message.toLowerCase().includes("invalid login")
        setAuthError(
          wrongCredentials
            ? "Email atau kata sandi salah."
            : "Koneksi bermasalah. Coba lagi.",
        )
        return
      }
      onSuccess()
    } catch {
      setAuthError("Koneksi bermasalah. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="screen auth">
      <AuthHeader
        title="Masuk ke akun"
        copy="Lanjutkan mengatur barang penting Anda."
        onBack={onBack}
      />
      <form className="auth__form" onSubmit={submit} noValidate>
        <TextInput
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          leading={<Mail size={20} />}
          autoComplete="email"
        />
        <TextInput
          label="Kata sandi"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
          leading={<LockKeyhole size={20} />}
          trailing={
            <Button
              type="button"
              variant="ghost"
              icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              iconOnly
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
              onClick={() => setShowPassword(!showPassword)}
            >
              Lihat
            </Button>
          }
          autoComplete="current-password"
        />
        {authError && (
          <div className="alert alert--error">
            <XCircle size={20} />
            <span>{authError}</span>
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          icon={loading ? <Spinner /> : undefined}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
      <p className="auth__switch">
        Belum punya akun?{" "}
        <button onClick={onRegister} className="text-link">
          Daftar
        </button>
      </p>
    </main>
  )
}

function RegisterScreen({
  onBack,
  onLogin,
  onSuccess,
  onConfirmationRequired,
}: {
  onBack: () => void
  onLogin: () => void
  onSuccess: () => void
  onConfirmationRequired: () => void
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const errors = {
    name: submitted && !form.name.trim() ? "Nama lengkap wajib diisi." : "",
    email:
      submitted && !form.email.trim()
        ? "Email wajib diisi."
        : submitted && !/^\S+@\S+\.\S+$/.test(form.email)
          ? "Masukkan email yang valid."
          : "",
    password:
      submitted && !form.password
        ? "Kata sandi wajib diisi."
        : submitted && form.password.length < 8
          ? "Kata sandi minimal 8 karakter."
          : "",
    confirm:
      submitted && !form.confirm
        ? "Konfirmasi kata sandi wajib diisi."
        : submitted && form.confirm !== form.password
          ? "Konfirmasi kata sandi belum sama."
          : "",
  }

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setAuthError("")
    if (
      !form.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(form.email) ||
      form.password.length < 8 ||
      !form.confirm ||
      form.confirm !== form.password
    )
      return
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.name.trim(),
          },
        },
      })
      if (error) {
        const message = error.message.toLowerCase()
        setAuthError(
          message.includes("already") || message.includes("registered")
            ? "Akun dengan email ini sudah terdaftar."
            : error.status && error.status >= 500
              ? "Koneksi bermasalah. Coba lagi."
              : "Pendaftaran gagal. Coba lagi.",
        )
        return
      }
      if (data.session) onSuccess()
      else onConfirmationRequired()
    } catch {
      setAuthError("Koneksi bermasalah. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="screen auth auth--register">
      <AuthHeader
        title="Buat akun baru"
        copy="Mulai catat barang dan lokasinya dengan rapi."
        onBack={onBack}
      />
      <form className="auth__form" onSubmit={submit} noValidate>
        <TextInput
          label="Nama lengkap"
          placeholder="Contoh: Raka Pratama"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          error={errors.name}
          leading={<User size={20} />}
          autoComplete="name"
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          error={errors.email}
          leading={<Mail size={20} />}
          autoComplete="email"
        />
        <TextInput
          label="Kata sandi"
          type="password"
          placeholder="Minimal 8 karakter"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          error={errors.password}
          leading={<LockKeyhole size={20} />}
          autoComplete="new-password"
        />
        <TextInput
          label="Konfirmasi kata sandi"
          type="password"
          placeholder="Ulangi kata sandi"
          value={form.confirm}
          onChange={(event) => update("confirm", event.target.value)}
          error={errors.confirm}
          leading={<LockKeyhole size={20} />}
          autoComplete="new-password"
        />
        {authError && (
          <div className="alert alert--error">
            <XCircle size={20} />
            <span>{authError}</span>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Membuat akun..." : "Daftar"}
        </Button>
      </form>
      <p className="auth__switch">
        Sudah punya akun?{" "}
        <button onClick={onLogin} className="text-link">
          Masuk
        </button>
      </p>
    </main>
  )
}

function SkeletonDashboard() {
  return (
    <div className="dashboard-skeleton" aria-label="Memuat Dashboard">
      <div className="skeleton skeleton--title" />
      <div className="summary-grid">
        {[0, 1, 2, 3].map((item) => (
          <div className="skeleton skeleton--summary" key={item} />
        ))}
      </div>
      <div className="skeleton skeleton--card" />
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--item" />
      <div className="skeleton skeleton--item" />
    </div>
  )
}

function DashboardScreen({
  onNavigate,
  notify,
  user,
  onAddItem,
  items,
  onSelectItem,
  quickSet,
  unreadCount,
  onOpenQuickSet,
  dataLoading,
  error,
  onRetry,
}: {
  onNavigate: (screen: Screen) => void
  notify: (message: string) => void
  user: UserDisplay
  onAddItem: () => void
  items: InventoryItem[]
  onSelectItem: (item: InventoryItem) => void
  quickSet?: QuickSet
  unreadCount: number
  onOpenQuickSet: (set: QuickSet) => void
  dataLoading: boolean
  error: string
  onRetry: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [sheet, setSheet] = useState<"activity" | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 850)
    return () => window.clearTimeout(timeout)
  }, [])

  const selectTab = (label: string) => {
    onNavigate(navigationMap[label])
  }

  return (
    <main className="screen dashboard">
      <header className="dashboard__header">
        <div>
          <p>Selamat pagi,</p>
          <h1>{user.fullName}</h1>
        </div>
        <div className="header-actions">
          <span className="notification-button">
            <Button
              variant="ghost"
              icon={<Bell size={22} />}
              iconOnly
              aria-label="Notifikasi"
              onClick={() => onNavigate("notifications")}
            >
              Notifikasi
            </Button>
            {unreadCount > 0 && <span>{unreadCount}</span>}
          </span>
          <button
            className="avatar"
            onClick={() => onNavigate("profile")}
            aria-label="Buka Profil"
          >
            {user.initials}
          </button>
        </div>
      </header>
      {loading || dataLoading ? (
        <SkeletonDashboard />
      ) : error ? (
        <div className="dashboard__content">
          <CollectionState
            state="error"
            subject="Dashboard"
            onRetry={onRetry}
          />
        </div>
      ) : (
        <div className="dashboard__content">
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Ringkasan</p>
                <h2>Dashboard</h2>
              </div>
              <span className="date-chip">Hari ini</span>
            </div>
            <div className="summary-grid">
              <article className="summary-card summary-card--total">
                <span className="summary-card__icon">
                  <Box size={20} />
                </span>
                <strong>{items.length}</strong>
                <span>Total Barang</span>
              </article>
              <article className="summary-card summary-card--available">
                <span className="summary-card__icon">
                  <CheckCircle2 size={20} />
                </span>
                <strong>
                  {items.filter((item) => item.status === "available").length}
                </strong>
                <span>Tersedia</span>
              </article>
              <article className="summary-card summary-card--unavailable">
                <span className="summary-card__icon">
                  <XCircle size={20} />
                </span>
                <strong>
                  {items.filter((item) => item.status === "unavailable").length}
                </strong>
                <span>Tidak Tersedia</span>
              </article>
              <article className="summary-card summary-card--borrowed">
                <span className="summary-card__icon">
                  <Clock3 size={20} />
                </span>
                <strong>
                  {items.filter((item) => item.status === "borrowed").length}
                </strong>
                <span>Dipinjam</span>
              </article>
            </div>
          </section>

          {quickSet && (
            <section className="activity-card">
              <div className="activity-card__icon">
                <BookOpen size={26} />
              </div>
              <div className="activity-card__body">
                <p className="eyebrow">Aktivitas Hari Ini</p>
                <h2>{quickSet.name}</h2>
                <p>
                  {quickSet.lastCheck.checkedIds.length} dari{" "}
                  {quickSet.itemIds.length} barang sudah dicek
                </p>
                <div className="progress">
                  <span
                    style={{
                      width: `${(quickSet.lastCheck.checkedIds.length / Math.max(quickSet.itemIds.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <Button
                variant="secondary"
                icon={<ArrowRight size={18} />}
                iconOnly
                aria-label="Lihat Quick Set Kuliah"
                onClick={() => onOpenQuickSet(quickSet)}
              >
                Buka
              </Button>
            </section>
          )}

          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Perlu dicek</p>
                <h2>Perhatian</h2>
              </div>
              <span className="count-badge">
                {items.filter((item) => item.status !== "available").length}
              </span>
            </div>
            <div className="warning-list">
              {items.filter((item) => item.status !== "available").length ? (
                items
                  .filter((item) => item.status !== "available")
                  .slice(0, 2)
                  .map((item) => (
                    <button
                      className="warning-row"
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                    >
                      <span className="warning-row__icon">
                        <AlertTriangle size={20} />
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.status === "borrowed"
                            ? `Dipinjam ${item.borrowedBy || ""}`
                            : "Berstatus Tidak Tersedia"}
                        </small>
                      </span>
                      <StatusBadge status={item.status} />
                    </button>
                  ))
              ) : (
                <div className="list-empty-row">
                  <CheckCircle2 size={20} />
                  <span>Tidak ada barang yang perlu diperhatikan.</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Terbaru</p>
                <h2>Baru diperbarui</h2>
              </div>
              <Button variant="ghost" onClick={() => onNavigate("inventory")}>
                Lihat semua
              </Button>
            </div>
            <div className="item-list">
              {items.length ? (
                items
                  .slice(0, 2)
                  .map((item) => (
                    <ItemCard
                      key={item.id}
                      name={item.name}
                      category={item.category}
                      location={item.locationPath}
                      status={item.status}
                      image={item.image}
                      onClick={() => onSelectItem(item)}
                    />
                  ))
              ) : (
                <div className="list-empty-row">
                  <Box size={20} />
                  <span>Belum ada barang yang diperbarui.</span>
                </div>
              )}
            </div>
          </section>

          <section className="empty-state">
            <span className="empty-state__icon">
              <PackageCheck size={28} />
            </span>
            <h2>Semua barang penting aman</h2>
            <p>Tidak ada perhatian tambahan untuk hari ini.</p>
          </section>
        </div>
      )}
      <FAB onClick={onAddItem} />
      <BottomTabBar onSelect={selectTab} />
      <BottomSheet
        open={sheet === "activity"}
        title="Quick Set Kuliah"
        onClose={() => setSheet(null)}
      >
        <div className="sheet-content">
          <div className="sheet-stat">
            <span>Perlengkapan siap</span>
            <strong>5 / 7</strong>
          </div>
          <div className="progress progress--large">
            <span style={{ width: "71%" }} />
          </div>
          <Button
            onClick={() => {
              setSheet(null)
              onNavigate("goodscheck")
            }}
          >
            Buka Goods Check
          </Button>
        </div>
      </BottomSheet>
    </main>
  )
}

function AppHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
}) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  )
}

function StateSwitcher({
  value,
  onChange,
}: {
  value: ViewState
  onChange: (state: ViewState) => void
}) {
  const states: { label: string value: ViewState }[] = [
    { label: "Isi", value: "data" },
    { label: "Memuat", value: "loading" },
    { label: "Kosong", value: "empty" },
    { label: "Bermasalah", value: "error" },
  ]
  return (
    <div className="state-switcher" aria-label="Pratinjau state">
      {states.map((state) => (
        <button
          key={state.value}
          className={value === state.value ? "active" : ""}
          onClick={() => onChange(state.value)}
        >
          {state.label}
        </button>
      ))}
    </div>
  )
}

function CollectionState({
  state,
  subject,
  onRetry,
}: {
  state: Exclude<ViewState, "data">
  subject: string
  onRetry: () => void
}) {
  if (state === "loading") {
    return (
      <div className="collection-loading" aria-label={`Memuat ${subject}`}>
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--item" />
        <div className="skeleton skeleton--item" />
        <div className="skeleton skeleton--item" />
      </div>
    )
  }

  if (state === "error") {
    return (
      <section className="empty-state empty-state--error">
        <span className="empty-state__icon">
          <AlertCircle size={28} />
        </span>
        <h2>{subject} gagal dimuat</h2>
        <p>Periksa koneksi Anda lalu coba kembali.</p>
        <Button
          variant="secondary"
          icon={<RefreshCw size={18} />}
          onClick={onRetry}
        >
          Coba lagi
        </Button>
      </section>
    )
  }

  return (
    <section className="empty-state">
      <span className="empty-state__icon">
        <Box size={28} />
      </span>
      <h2>Belum ada {subject.toLowerCase()}</h2>
      <p>Konten baru akan muncul di sini setelah ditambahkan.</p>
      <Button variant="secondary" icon={<Plus size={18} />}>
        Tambah baru
      </Button>
    </section>
  )
}

function AppTabBar({
  active,
  onNavigate,
  notify,
}: {
  active: string
  onNavigate: (screen: Screen) => void
  notify: (message: string) => void
}) {
  return (
    <BottomTabBar
      active={active}
      onSelect={(label) => {
        onNavigate(navigationMap[label])
      }}
    />
  )
}

function ProfileScreen({
  user,
  onNavigate,
  notify,
  onSignOut,
}: {
  user: UserDisplay
  onNavigate: (screen: Screen) => void
  notify: (message: string) => void
  onSignOut: () => Promise<void>
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const signOut = async () => {
    setLoading(true)
    await onSignOut()
    setLoading(false)
  }

  return (
    <main className="screen app-page">
      <AppHeader eyebrow="Akun" title="Profil" />
      <div className="app-page__content profile-content">
        <section className="profile-card">
          <span className="profile-avatar">{user.initials}</span>
          <div>
            <h2>{user.fullName}</h2>
            <p>{user.email}</p>
          </div>
        </section>
        <section className="profile-details">
          <div>
            <span>Nama lengkap</span>
            <strong>{user.fullName}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </section>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Keluar
        </Button>
      </div>
      <AppTabBar active="Profil" onNavigate={onNavigate} notify={notify} />
      {confirmOpen && (
        <div className="dialog-layer" role="presentation">
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <span className="confirm-dialog__icon">
              <UserRound size={24} />
            </span>
            <h2 id="logout-title">Keluar dari akun?</h2>
            <p>Anda perlu masuk kembali untuk mengakses PIMS.</p>
            <div className="confirm-dialog__actions">
              <Button
                variant="secondary"
                disabled={loading}
                onClick={() => setConfirmOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                disabled={loading}
                icon={loading ? <Spinner /> : undefined}
                onClick={signOut}
              >
                {loading ? "Memproses..." : "Keluar"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function DesignSystemScreen({
  onBack,
  notify,
}: {
  onBack: () => void
  notify: (message: string) => void
}) {
  const colorTokens = [
    ["Primary", "#35746E", "ds-color--primary"],
    ["Primary Light", "#5E948F", "ds-color--primary-light"],
    ["Tint", "#CCFBF1", "ds-color--tint"],
    ["Text", "#0F172A", "ds-color--text"],
    ["Secondary", "#475569", "ds-color--secondary"],
    ["Background", "#F8FAFC", "ds-color--background"],
    ["Border", "#E2E8F0", "ds-color--border"],
    ["Surface", "#FFFFFF", "ds-color--surface"],
    ["Tersedia", "#15803D", "ds-color--available"],
    ["Tidak Tersedia", "#B91C1C", "ds-color--unavailable"],
    ["Dipinjam", "#B45309", "ds-color--borrowed"],
  ]
  const typography = [
    ["Display", "28 / 36", "700", "type-display"],
    ["Heading 1", "22 / 28", "700", "type-h1"],
    ["Heading 2", "18 / 24", "600", "type-h2"],
    ["Body", "15 / 22", "400", "type-body"],
    ["Label", "13 / 18", "500", "type-label"],
    ["Caption", "12 / 16", "400", "type-caption"],
  ]
  const buttonRows = [
    ["Primary", "primary"],
    ["Secondary", "secondary"],
    ["Outline", "outline"],
    ["Destructive", "destructive"],
  ] as const

  return (
    <main className="screen design-system">
      <header className="design-system__header">
        <Button
          variant="ghost"
          icon={<ArrowLeft size={22} />}
          iconOnly
          aria-label="Kembali"
          onClick={onBack}
        >
          Kembali
        </Button>
        <div>
          <p className="eyebrow">PIMS · Product Foundation</p>
          <h1>Design System</h1>
        </div>
        <div className="ds-header-meta">
          <span>Plus Jakarta Sans</span>
          <span>8pt grid</span>
          <span>Mobile-first</span>
        </div>
      </header>

      <div className="ds-board">
        <section className="ds-section ds-section--colors">
          <div className="ds-section__title">
            <span>01</span>
            <div>
              <p className="eyebrow">Foundation</p>
              <h2>Color tokens</h2>
            </div>
          </div>
          <div className="ds-color-grid">
            {colorTokens.map(([name, hex, className]) => (
              <div className="ds-color" key={name}>
                <span className={className} />
                <div>
                  <strong>{name}</strong>
                  <small>{hex}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section ds-section--type">
          <div className="ds-section__title">
            <span>02</span>
            <div>
              <p className="eyebrow">Foundation</p>
              <h2>Typography scale</h2>
            </div>
          </div>
          <div className="ds-type-list">
            {typography.map(([name, size, weight, className]) => (
              <div key={name}>
                <span className={className}>Aa</span>
                <strong>{name}</strong>
                <small>
                  {size} · {weight}
                </small>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section ds-section--buttons">
          <div className="ds-section__title">
            <span>03</span>
            <div>
              <p className="eyebrow">Actions</p>
              <h2>Buttons</h2>
            </div>
          </div>
          <div className="ds-button-table">
            <div className="ds-table-head">
              <span />
              <span>Default</span>
              <span>Pressed</span>
              <span>Disabled</span>
              <span>Loading</span>
            </div>
            {buttonRows.map(([label, variant]) => (
              <div className="ds-button-row" key={label}>
                <strong>{label}</strong>
                <button
                  className={`button ds-button--${variant}`}
                  onClick={() => notify(`${label} default`)}
                >
                  Button
                </button>
                <button
                  className={`button ds-button--${variant} ds-button--pressed`}
                  onClick={() => notify(`${label} pressed`)}
                >
                  Button
                </button>
                <button className={`button ds-button--${variant}`} disabled>
                  Button
                </button>
                <button
                  className={`button ds-button--${variant}`}
                  onClick={() => notify(`${label} loading`)}
                >
                  <Spinner /> Loading
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section ds-section--inputs">
          <div className="ds-section__title">
            <span>04</span>
            <div>
              <p className="eyebrow">Forms</p>
              <h2>Inputs</h2>
            </div>
          </div>
          <div className="ds-input-grid">
            <label className="field">
              <span className="field__label">Default</span>
              <span className="field__control">
                <input placeholder="Nama barang" />
              </span>
            </label>
            <label className="field">
              <span className="field__label">Focus</span>
              <span className="field__control field__control--focus">
                <input value="Laptop ASUS" readOnly />
              </span>
            </label>
            <TextInput
              label="Error"
              value=""
              readOnly
              placeholder="Pilih lokasi"
              error="Lokasi wajib dipilih."
            />
            <label className="field">
              <span className="field__label">Disabled</span>
              <span className="field__control field__control--disabled">
                <input value="Tidak dapat diubah" disabled readOnly />
              </span>
            </label>
            <label className="field">
              <span className="field__label">Search</span>
              <span className="field__control">
                <Search size={18} />
                <input placeholder="Cari barang..." />
              </span>
            </label>
            <label className="field">
              <span className="field__label">Dropdown</span>
              <span className="field__control select-control">
                <select defaultValue="Elektronik">
                  <option>Elektronik</option>
                  <option>Dokumen</option>
                </select>
                <ChevronDown size={18} />
              </span>
            </label>
          </div>
        </section>

        <section className="ds-section ds-section--cards">
          <div className="ds-section__title">
            <span>05</span>
            <div>
              <p className="eyebrow">Content</p>
              <h2>Cards & status</h2>
            </div>
          </div>
          <div className="ds-card-layout">
            <ItemCard
              name="Laptop ASUS"
              category="Elektronik"
              location="Rumah › Kamar › Meja"
              status="available"
              image={laptopPhoto}
              onClick={() => notify("Item card")}
            />
            <article className="summary-card summary-card--available">
              <span className="summary-card__icon">
                <CheckCircle2 size={20} />
              </span>
              <strong>18</strong>
              <span>Tersedia</span>
            </article>
          </div>
          <div className="ds-status-row">
            <StatusBadge status="available" />
            <StatusBadge status="unavailable" />
            <StatusBadge status="borrowed" />
            <span className="date-chip">Elektronik</span>
            <span className="date-chip">Kuliah</span>
          </div>
          <div className="ds-progress">
            <span>71% siap</span>
            <div className="progress progress--large">
              <span style={{ width: "71%" }} />
            </div>
          </div>
        </section>

        <section className="ds-section ds-section--navigation">
          <div className="ds-section__title">
            <span>06</span>
            <div>
              <p className="eyebrow">Patterns</p>
              <h2>Navigation & overlays</h2>
            </div>
          </div>
          <div className="ds-nav-preview">
            <div className="tabbar-preview">
              <BottomTabBar
                onSelect={(label) => notify(`Tab ${label} dipilih.`)}
              />
            </div>
            <div className="ds-fab-sample">
              <span>FAB</span>
              <button
                className="button button--primary button--icon"
                aria-label="Tambah Barang"
                onClick={() => notify("FAB dipilih")}
              >
                <Plus size={22} />
              </button>
            </div>
          </div>
          <div className="ds-overlay-grid">
            <div className="ds-mini-sheet">
              <span />
              <strong>Bottom sheet</strong>
              <small>Pilih lokasi barang</small>
            </div>
            <div className="ds-mini-dialog">
              <AlertTriangle size={18} />
              <strong>Hapus barang?</strong>
              <small>Tindakan tidak dapat dibatalkan.</small>
            </div>
            <div className="ds-mini-toast">
              <CheckCircle2 size={17} />
              Barang berhasil disimpan
            </div>
            <div className="notification-row unread">
              <span className="notification-row__icon">
                <Bell size={18} />
              </span>
              <span>
                <strong>Pengingat Kuliah</strong>
                <small>5 dari 7 barang siap</small>
              </span>
              <i />
            </div>
          </div>
        </section>

        <section className="ds-section ds-section--states">
          <div className="ds-section__title">
            <span>07</span>
            <div>
              <p className="eyebrow">Feedback</p>
              <h2>States</h2>
            </div>
          </div>
          <div className="ds-states-grid">
            <div className="empty-state empty-state--compact">
              <PackageCheck size={25} />
              <h2>Belum ada barang</h2>
              <p>Tambahkan barang pertama.</p>
            </div>
            <div className="ds-skeleton-state">
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--item" />
            </div>
            <div className="empty-state empty-state--error">
              <AlertCircle size={25} />
              <h2>Gagal dimuat</h2>
              <p>Koneksi bermasalah.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [previousScreen, setPreviousScreen] = useState<Screen>("splash")
  const [toast, setToast] = useState("")
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [locations, setLocations] = useState<LocationNode[]>([])
  const [inventoryLoading, setInventoryLoading] = useState(false)
  const [inventoryError, setInventoryError] = useState("")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>()
  const [quickSets, setQuickSets] = useState<QuickSet[]>([])
  const [quickSetsLoading, setQuickSetsLoading] = useState(false)
  const [selectedQuickSet, setSelectedQuickSet] = useState<QuickSet | null>(
    null,
  )
  const [editingQuickSet, setEditingQuickSet] = useState<QuickSet | undefined>()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [notificationBanner, setNotificationBanner] = useState("")

  useEffect(() => {
    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setSession(data.session)
        if (data.session) setScreen("dashboard")
      })
      .finally(() => {
        if (active) setAuthReady(true)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      if (event === "SIGNED_IN") setScreen("dashboard")
      if (event === "SIGNED_OUT") setScreen("login")
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const loadInventory = async () => {
    if (!session) return
    setInventoryLoading(true)
    setQuickSetsLoading(true)
    setInventoryError("")
    try {
      const [
        inventoryResult,
        locationsResult,
        quickSetsResult,
        notificationsResult,
      ] = await Promise.all([
        inventoryApi.list(),
        inventoryApi.locations(),
        quickSetsApi.list(),
        notificationsApi.list(),
      ])
      setInventory(inventoryResult.items)
      setLocations(locationsResult.locations)
      setQuickSets(quickSetsResult.quickSets)
      setNotifications(notificationsResult.notifications)
      const newestWarning = notificationsResult.notifications.find(
        (item) => !item.read,
      )
      if (newestWarning) {
        setNotificationBanner(newestWarning.title)
        window.setTimeout(() => setNotificationBanner(""), 4200)
      }
    } catch {
      setInventoryError("Koneksi bermasalah. Coba lagi.")
    } finally {
      setInventoryLoading(false)
      setQuickSetsLoading(false)
    }
  }

  useEffect(() => {
    if (session) void loadInventory()
    else {
      setInventory([])
      setLocations([])
      setQuickSets([])
      setNotifications([])
    }
  }, [session?.user.id])

  const metadataFullName = session?.user.user_metadata.full_name
  const fullName =
    (typeof metadataFullName === "string" && metadataFullName.trim()) ||
    session?.user.email?.split("@")[0] ||
    "Pengguna PIMS"
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PI"
  const user: UserDisplay = {
    fullName,
    email: session?.user.email || "",
    initials,
  }

  const navigate = (next: Screen) => {
    const protectedScreens: Screen[] = [
      "dashboard",
      "inventory",
      "quicksets",
      "quickset-detail",
      "quickset-form",
      "goodscheck",
      "notifications",
      "locations",
      "item-form",
      "item-detail",
      "profile",
    ]
    if (protectedScreens.includes(next) && !session) {
      setScreen("login")
      return
    }
    setPreviousScreen(screen)
    setScreen(next)
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2800)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      notify("Koneksi bermasalah. Coba lagi.")
      return
    }
    setSession(null)
    setScreen("login")
  }

  const openAddItem = () => {
    setEditingItem(undefined)
    navigate("item-form")
  }

  const openItem = (item: InventoryItem) => {
    setSelectedItem(item)
    navigate("item-detail")
  }

  const saveItem = async (input: InventoryInput, id?: string) => {
    try {
      if (id) {
        const { item } = await inventoryApi.update(id, input)
        setInventory((current) =>
          current.map((existing) => (existing.id === id ? item : existing)),
        )
        setSelectedItem(item)
      } else {
        const { item } = await inventoryApi.create(input)
        setInventory((current) => [item, ...current])
      }
      notify("Barang berhasil disimpan")
      navigate("inventory")
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await inventoryApi.remove(id)
      setInventory((current) => current.filter((item) => item.id !== id))
      setSelectedItem(null)
      notify("Barang dihapus")
      navigate("inventory")
      return true
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
      return false
    }
  }

  const updateItemLocation = async (
    item: InventoryItem,
    location: LocationNode,
    path: string,
  ) => {
    try {
      const { item: updated } = await inventoryApi.update(item.id, {
        locationId: location.id,
        locationPath: path,
        locationType: location.type,
      })
      setInventory((current) =>
        current.map((existing) =>
          existing.id === updated.id ? updated : existing,
        ),
      )
      setSelectedItem(updated)
      notify("Lokasi diperbarui")
      return true
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
      return false
    }
  }

  const addLocation = async (input: Omit<LocationNode, "id">) => {
    try {
      const { location } = await inventoryApi.createLocation(input)
      setLocations((current) => [...current, location])
      notify("Lokasi berhasil ditambahkan")
      return true
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
      return false
    }
  }

  const openQuickSet = (quickSet: QuickSet) => {
    setSelectedQuickSet(quickSet)
    navigate("quickset-detail")
  }

  const openQuickSetForm = (quickSet?: QuickSet) => {
    setEditingQuickSet(quickSet)
    navigate("quickset-form")
  }

  const saveQuickSet = async (input: QuickSetInput, id?: string) => {
    try {
      const { quickSet } = id
        ? await quickSetsApi.update(id, input)
        : await quickSetsApi.create(input)
      setQuickSets((current) =>
        id
          ? current.map((set) => (set.id === id ? quickSet : set))
          : [quickSet, ...current],
      )
      setSelectedQuickSet(quickSet)
      notify("Quick Set disimpan")
      if (input.reminder.enabled) {
        const { notifications: nextNotifications } =
          await notificationsApi.list()
        setNotifications(nextNotifications)
        setNotificationBanner(`${quickSet.name} dimulai ${input.reminder.time}`)
        window.setTimeout(() => setNotificationBanner(""), 4200)
      }
      navigate("quickset-detail")
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
    }
  }

  const deleteQuickSet = async (id: string) => {
    try {
      await quickSetsApi.remove(id)
      setQuickSets((current) => current.filter((set) => set.id !== id))
      setSelectedQuickSet(null)
      notify("Quick Set dihapus")
      navigate("quicksets")
      return true
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
      return false
    }
  }

  const completeGoodsCheck = async (
    checkedIds: string[],
    ignoredIds: string[],
  ) => {
    const activeSet = selectedQuickSet || quickSets[0]
    if (!activeSet) return
    try {
      const { quickSet } = await quickSetsApi.saveCheck(activeSet.id, {
        checkedIds,
        ignoredIds,
      })
      setQuickSets((current) =>
        current.map((set) => (set.id === quickSet.id ? quickSet : set)),
      )
      setSelectedQuickSet(quickSet)
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
    }
  }

  const markItemBorrowed = async (item: InventoryItem) => {
    try {
      const { item: updated } = await inventoryApi.update(item.id, {
        status: "borrowed",
        borrowedBy: item.borrowedBy || "Tidak diketahui",
      })
      setInventory((current) =>
        current.map((existing) =>
          existing.id === updated.id ? updated : existing,
        ),
      )
      notify("Barang ditandai Dipinjam")
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
    }
  }

  const openNotification = async (notification: AppNotification) => {
    try {
      const { notifications: nextNotifications } = await notificationsApi.read(
        notification.id,
      )
      setNotifications(nextNotifications)
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
    }
    if (notification.target === "item") {
      const item = inventory.find(
        (candidate) => candidate.id === notification.targetId,
      )
      if (item) openItem(item)
    } else {
      const quickSet = quickSets.find(
        (candidate) => candidate.id === notification.targetId,
      )
      if (quickSet) openQuickSet(quickSet)
    }
  }

  const readAllNotifications = async () => {
    try {
      const { notifications: nextNotifications } =
        await notificationsApi.readAll()
      setNotifications(nextNotifications)
    } catch {
      notify("Koneksi bermasalah. Coba lagi.")
    }
  }

  const appScreens: Screen[] = [
    "dashboard",
    "inventory",
    "quicksets",
    "quickset-detail",
    "quickset-form",
    "goodscheck",
    "notifications",
    "locations",
    "item-form",
    "item-detail",
    "profile",
  ]
  const isAppScreen = appScreens.includes(screen)

  if (!authReady) {
    return (
      <div className="prototype">
        <div className="phone-frame">
          <main className="screen session-loading">
            <LogoMark />
            <Spinner />
            <p>Menyiapkan akun...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="prototype">
      <div
        className={`phone-frame ${isAppScreen ? "app-frame" : ""} ${
          screen === "design" ? "design-frame" : ""
        }`}
      >
        <div className={isAppScreen ? "app-layout" : "auth-layout"}>
          {isAppScreen && (
            <DesktopSidebar active={screen} onNavigate={navigate} user={user} />
          )}
          <div className="app-viewport">
            {screen === "splash" && (
              <SplashScreen
                onLogin={() => navigate("login")}
                onRegister={() => navigate("register")}
                onDesign={() => navigate("design")}
              />
            )}
            {screen === "login" && (
              <LoginScreen
                onBack={() => navigate("splash")}
                onRegister={() => navigate("register")}
                onSuccess={() => navigate("dashboard")}
              />
            )}
            {screen === "register" && (
              <RegisterScreen
                onBack={() => navigate("splash")}
                onLogin={() => navigate("login")}
                onSuccess={() => navigate("dashboard")}
                onConfirmationRequired={() => {
                  notify("Akun berhasil dibuat. Silakan masuk.")
                  navigate("login")
                }}
              />
            )}
            {screen === "dashboard" && (
              <DashboardScreen
                onNavigate={navigate}
                notify={notify}
                user={user}
                items={inventory}
                onAddItem={openAddItem}
                onSelectItem={openItem}
                quickSet={quickSets[0]}
                unreadCount={notifications.filter((item) => !item.read).length}
                onOpenQuickSet={openQuickSet}
                dataLoading={inventoryLoading}
                error={inventoryError}
                onRetry={loadInventory}
              />
            )}
            {screen === "inventory" && (
              <LiveInventoryScreen
                items={inventory}
                locations={locations}
                loading={inventoryLoading}
                error={inventoryError}
                onReload={loadInventory}
                onNavigate={navigate}
                onAdd={openAddItem}
                onSelect={openItem}
              />
            )}
            {screen === "quicksets" && (
              <LiveQuickSetsScreen
                quickSets={quickSets}
                items={inventory}
                loading={quickSetsLoading}
                error={inventoryError}
                onRetry={loadInventory}
                onNavigate={navigate}
                onAdd={() => openQuickSetForm()}
                onSelect={openQuickSet}
              />
            )}
            {screen === "quickset-detail" && selectedQuickSet && (
              <QuickSetDetailScreen
                quickSet={selectedQuickSet}
                items={inventory}
                onBack={() => navigate("quicksets")}
                onItem={openItem}
                onStart={() => navigate("goodscheck")}
                onEdit={() => openQuickSetForm(selectedQuickSet)}
                onDelete={() => deleteQuickSet(selectedQuickSet.id)}
              />
            )}
            {screen === "quickset-form" && (
              <QuickSetFormScreen
                quickSet={editingQuickSet}
                items={inventory}
                onCancel={() =>
                  navigate(editingQuickSet ? "quickset-detail" : "quicksets")
                }
                onSave={saveQuickSet}
              />
            )}
            {screen === "goodscheck" && (selectedQuickSet || quickSets[0]) && (
              <LiveGoodsCheckScreen
                quickSet={(selectedQuickSet || quickSets[0])!}
                items={inventory}
                onNavigate={navigate}
                onItem={openItem}
                onBorrow={markItemBorrowed}
                onComplete={completeGoodsCheck}
              />
            )}
            {screen === "goodscheck" && !selectedQuickSet && !quickSets[0] && (
              <main className="screen app-page">
                <div className="app-page__content">
                  {quickSetsLoading ? (
                    <div className="collection-loading">
                      <div className="skeleton skeleton--item" />
                      <div className="skeleton skeleton--item" />
                    </div>
                  ) : inventoryError ? (
                    <CollectionState
                      state="error"
                      subject="Goods Check"
                      onRetry={loadInventory}
                    />
                  ) : (
                    <section className="empty-state">
                      <ClipboardCheck size={28} />
                      <h2>Belum ada Quick Set untuk diperiksa.</h2>
                      <p>Buat Quick Set sebelum memulai Goods Check.</p>
                      <Button onClick={() => navigate("quicksets")}>
                        Buka Quick Sets
                      </Button>
                    </section>
                  )}
                </div>
                <AppTabBar
                  active="Goods Check"
                  onNavigate={navigate}
                  notify={notify}
                />
              </main>
            )}
            {screen === "notifications" && (
              <LiveNotificationsScreen
                notifications={notifications}
                loading={inventoryLoading}
                error={inventoryError}
                onRetry={loadInventory}
                onNavigate={navigate}
                onRead={openNotification}
                onReadAll={readAllNotifications}
              />
            )}
            {screen === "locations" && (
              <LiveLocationsScreen
                items={inventory}
                locations={locations}
                loading={inventoryLoading}
                error={inventoryError}
                onRetry={loadInventory}
                onNavigate={navigate}
                onAddLocation={addLocation}
              />
            )}
            {screen === "item-form" && (
              <ItemFormScreen
                item={editingItem}
                items={inventory}
                locations={locations}
                onCancel={() =>
                  navigate(editingItem ? "item-detail" : "inventory")
                }
                onSave={saveItem}
              />
            )}
            {screen === "item-detail" && selectedItem && (
              <ItemDetailScreen
                item={selectedItem}
                items={inventory}
                locations={locations}
                onBack={() => navigate("inventory")}
                onEdit={() => {
                  setEditingItem(selectedItem)
                  navigate("item-form")
                }}
                onDelete={() => deleteItem(selectedItem.id)}
                onUpdateLocation={(location, path) =>
                  updateItemLocation(selectedItem, location, path)
                }
              />
            )}
            {screen === "profile" && (
              <ProfileScreen
                user={user}
                onNavigate={navigate}
                notify={notify}
                onSignOut={signOut}
              />
            )}
            {screen === "design" && (
              <DesignSystemScreen
                onBack={() =>
                  setScreen(
                    previousScreen === "design" ? "dashboard" : previousScreen,
                  )
                }
                notify={notify}
              />
            )}
          </div>
        </div>
        {notificationBanner && (
          <div className="notification-banner" role="status">
            <span className="notification-row__icon">
              <AlertTriangle size={20} />
            </span>
            <span>
              <strong>Peringatan baru</strong>
              <small>{notificationBanner}</small>
            </span>
            <button onClick={() => setNotificationBanner("")}>
              <X size={18} />
            </button>
          </div>
        )}
        {toast && <Toast message={toast} />}
      </div>
    </div>
  )
}
