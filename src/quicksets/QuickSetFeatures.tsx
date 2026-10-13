import {
  type CSSProperties,
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react"
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BookOpen,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Home,
  Layers3,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  Trash2,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from "../icons"
import type { InventoryItem } from "../lib/inventory"
import type { AppNotification, QuickSet, QuickSetInput } from "../lib/quicksets"

type ScreenName = "dashboard" | "inventory" | "quicksets" | "goodscheck" | "notifications" | "profile" | "item-detail"

function ActionButton({
  children,
  variant = "primary",
  icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  icon?: ReactNode
}) {
  return (
    <button className={`button button--${variant}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  )
}

function StatusBadge({ status }: { status: InventoryItem["status"] }) {
  const Icon =
    status === "available"
      ? CheckCircle2
      : status === "borrowed"
        ? Clock3
        : XCircle
  const label =
    status === "available"
      ? "Tersedia"
      : status === "borrowed"
        ? "Dipinjam"
        : "Tidak Tersedia"
  return (
    <span className={`status status--${status}`}>
      <Icon size={14} />
      {label}
    </span>
  )
}

function ActivityIcon({ name, size = 24 }: { name: string size?: number }) {
  const Icon =
    name === "olahraga"
      ? PackageCheck
      : name === "mudik" || name === "traveling"
        ? WalletCards
        : name === "menginap"
          ? Layers3
          : name === "kerja"
            ? Box
            : BookOpen
  return <Icon size={size} />
}

function ItemThumb({ item }: { item: InventoryItem }) {
  if (item.image) return <img src={item.image} alt="" />
  return (
    <span>
      <Box size={24} />
    </span>
  )
}

function ItemRow({
  item,
  onClick,
  actions,
}: {
  item: InventoryItem
  onClick?: () => void
  actions?: ReactNode
}) {
  return (
    <div className="quick-item-row">
      <button
        className="quick-item-row__main"
        disabled={!onClick}
        onClick={onClick}
      >
        <ItemThumb item={item} />
        <span>
          <strong>{item.name}</strong>
          <small>
            <MapPin size={13} /> {item.locationPath}
          </small>
        </span>
        <StatusBadge status={item.status} />
      </button>
      {actions}
    </div>
  )
}

function AppTabs({
  active,
  onNavigate,
}: {
  active: string
  onNavigate: (screen: ScreenName) => void
}) {
  const tabs = [
    { label: "Beranda", screen: "dashboard" as ScreenName, Icon: Home },
    { label: "Inventaris", screen: "inventory" as ScreenName, Icon: Box },
    { label: "Quick Sets", screen: "quicksets" as ScreenName, Icon: Layers3 },
    {
      label: "Goods Check",
      screen: "goodscheck" as ScreenName,
      Icon: ClipboardCheck,
    },
    { label: "Profil", screen: "profile" as ScreenName, Icon: UserRound },
  ]
  return (
    <nav className="tabbar" aria-label="Navigasi utama">
      {tabs.map(({ label, screen, Icon }) => (
        <button
          key={label}
          className={`tabbar__item ${
            active === label ? "tabbar__item--active" : ""
          }`}
          onClick={() => onNavigate(screen)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

const readiness = (set: QuickSet, items: InventoryItem[]) => {
  const setItems = set.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as InventoryItem[]
  if (!setItems.length) return 0
  const ready = setItems.filter((item) => item.status === "available").length
  return Math.round((ready / setItems.length) * 100)
}

export function QuickSetsScreen({
  quickSets,
  items,
  loading,
  error,
  onRetry,
  onNavigate,
  onAdd,
  onSelect,
}: {
  quickSets: QuickSet[]
  items: InventoryItem[]
  loading: boolean
  error: string
  onRetry: () => void
  onNavigate: (screen: ScreenName) => void
  onAdd: () => void
  onSelect: (set: QuickSet) => void
}) {
  return (
    <main className="screen app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Aktivitas</p>
          <h1>Quick Sets</h1>
        </div>
        <ActionButton
          className="desktop-action"
          icon={<Plus size={18} />}
          onClick={onAdd}
        >
          Buat Quick Set
        </ActionButton>
      </header>
      <div className="app-page__content">
        {loading ? (
          <div className="collection-loading">
            <div className="skeleton skeleton--item" />
            <div className="skeleton skeleton--item" />
          </div>
        ) : error ? (
          <section className="empty-state empty-state--error">
            <AlertTriangle size={28} />
            <h2>Quick Sets gagal dimuat</h2>
            <p>Koneksi bermasalah. Coba lagi.</p>
            <ActionButton variant="secondary" onClick={onRetry}>
              Coba lagi
            </ActionButton>
          </section>
        ) : quickSets.length ? (
          <div className="set-grid">
            {quickSets.map((set) => {
              const percent = readiness(set, items)
              return (
                <button
                  className="set-card"
                  key={set.id}
                  onClick={() => onSelect(set)}
                >
                  <span className="set-card__icon">
                    <ActivityIcon name={set.icon} />
                  </span>
                  <span className="set-card__heading">
                    <strong>{set.name}</strong>
                    <ChevronRight size={18} />
                  </span>
                  <small>{set.itemIds.length} barang</small>
                  <span className="progress progress--large">
                    <span style={{ width: `${percent}%` }} />
                  </span>
                  <span className="set-card__ready">{percent}% siap</span>
                </button>
              )
            })}
          </div>
        ) : (
          <section className="empty-state">
            <Layers3 size={32} />
            <h2>Belum ada Quick Set</h2>
            <p>Buat aktivitas agar persiapan barang lebih cepat.</p>
            <ActionButton icon={<Plus size={18} />} onClick={onAdd}>
              Buat Quick Set
            </ActionButton>
          </section>
        )}
      </div>
      <button
        className="button button--primary button--icon fab"
        aria-label="Buat Quick Set"
        onClick={onAdd}
      >
        <Plus size={24} />
      </button>
      <AppTabs active="Quick Sets" onNavigate={onNavigate} />
    </main>
  )
}

export function QuickSetDetailScreen({
  quickSet,
  items,
  onBack,
  onItem,
  onStart,
  onEdit,
  onDelete,
}: {
  quickSet: QuickSet
  items: InventoryItem[]
  onBack: () => void
  onItem: (item: InventoryItem) => void
  onStart: () => void
  onEdit: () => void
  onDelete: () => Promise<boolean>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const setItems = quickSet.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as InventoryItem[]
  const attention = setItems.filter((item) => item.status !== "available")
  const percent = readiness(quickSet, items)

  return (
    <main className="screen app-page">
      <header className="flow-header">
        <button className="button button--ghost button--icon" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>
        <div className="detail-menu">
          <button
            className="button button--ghost button--icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <ChevronDown size={22} />
          </button>
          {menuOpen && (
            <div className="detail-menu__popover">
              <button onClick={onEdit}>Edit set</button>
              <button className="danger" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={16} /> Hapus set
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="app-page__content quick-detail-content">
        <section className="quick-detail-hero">
          <span className="quick-detail-hero__icon">
            <ActivityIcon name={quickSet.icon} size={30} />
          </span>
          <div>
            <p className="eyebrow">Quick Set</p>
            <h1>{quickSet.name}</h1>
            <span>{setItems.length} barang</span>
          </div>
          <div
            className="readiness-ring"
            style={{ "--progress": `${percent * 3.6}deg` } as CSSProperties}
          >
            <strong>{percent}%</strong>
            <small>siap</small>
          </div>
        </section>

        {attention.length > 0 && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Perlu dicek</p>
                <h2>Perlu perhatian</h2>
              </div>
              <span className="count-badge">{attention.length}</span>
            </div>
            <div className="attention-items">
              {attention.map((item) => (
                <ItemRow
                  item={item}
                  key={item.id}
                  onClick={() => onItem(item)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="section-heading">
            <h2>Semua barang</h2>
            <span className="date-chip">{setItems.length} barang</span>
          </div>
          <div className="quick-items">
            {setItems.length ? (
              setItems.map((item) => (
                <ItemRow
                  item={item}
                  key={item.id}
                  onClick={() => onItem(item)}
                />
              ))
            ) : (
              <section className="empty-state empty-state--compact">
                <Box size={28} />
                <h2>Belum ada barang dalam Quick Set ini.</h2>
              </section>
            )}
          </div>
        </section>
        <ActionButton icon={<ClipboardCheck size={18} />} onClick={onStart}>
          Mulai Goods Check
        </ActionButton>
      </div>
      {deleteOpen && (
        <div className="dialog-layer">
          <section className="confirm-dialog" role="dialog">
            <span className="confirm-dialog__icon">
              <Trash2 size={24} />
            </span>
            <h2>Hapus Quick Set?</h2>
            <p>{quickSet.name} akan dihapus dari daftar aktivitas.</p>
            <div className="confirm-dialog__actions">
              <ActionButton
                variant="secondary"
                onClick={() => setDeleteOpen(false)}
              >
                Batal
              </ActionButton>
              <ActionButton
                variant="destructive"
                onClick={async () => {
                  const success = await onDelete()
                  if (!success) setDeleteOpen(false)
                }}
              >
                Hapus
              </ActionButton>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

const activityIcons = [
  ["kuliah", "Kuliah"],
  ["olahraga", "Olahraga"],
  ["mudik", "Mudik"],
  ["kerja", "Kerja"],
  ["menginap", "Menginap"],
  ["traveling", "Traveling"],
]
const dayOptions = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

export function QuickSetFormScreen({
  quickSet,
  items,
  onCancel,
  onSave,
}: {
  quickSet?: QuickSet
  items: InventoryItem[]
  onCancel: () => void
  onSave: (input: QuickSetInput, id?: string) => Promise<void>
}) {
  const [name, setName] = useState(quickSet?.name || "")
  const [icon, setIcon] = useState(quickSet?.icon || "kuliah")
  const [selected, setSelected] = useState<string[]>(quickSet?.itemIds || [])
  const [search, setSearch] = useState("")
  const [reminder, setReminder] = useState(
    quickSet?.reminder || {
      enabled: false,
      days: [] as string[],
      time: "06:30",
    },
  )
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const visible = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!name.trim() || !selected.length) return
    setSaving(true)
    await onSave(
      { name: name.trim(), icon, itemIds: selected, reminder },
      quickSet?.id,
    )
    setSaving(false)
  }

  return (
    <main className="screen item-form-screen">
      <header className="flow-header">
        <button
          className="button button--ghost button--icon"
          onClick={onCancel}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <p className="eyebrow">Quick Sets</p>
          <h1>{quickSet ? "Edit Quick Set" : "Buat Quick Set"}</h1>
        </div>
      </header>
      <form className="quick-set-form" onSubmit={submit}>
        <section className="form-section">
          <label className="field">
            <span className="field__label">Nama aktivitas</span>
            <span
              className={`field__control ${
                submitted && !name.trim() ? "field__control--error" : ""
              }`}
            >
              <input
                value={name}
                placeholder="Contoh: Kuliah pagi"
                onChange={(event) => setName(event.target.value)}
              />
            </span>
            {submitted && !name.trim() && (
              <span className="field__message field__message--error">
                <AlertTriangle size={14} /> Nama aktivitas wajib diisi.
              </span>
            )}
          </label>
          <div className="field">
            <span className="field__label">Ikon aktivitas</span>
            <div className="activity-icon-grid">
              {activityIcons.map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={icon === value ? "active" : ""}
                  onClick={() => setIcon(value)}
                >
                  <ActivityIcon name={value} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <h2>Pilih barang</h2>
            <span className="count-badge">
              {selected.length} barang dipilih
            </span>
          </div>
          <label className="field">
            <span className="field__control">
              <Search size={18} />
              <input
                value={search}
                placeholder="Cari barang..."
                onChange={(event) => setSearch(event.target.value)}
              />
            </span>
          </label>
          <div className="selectable-items">
            {visible.map((item) => {
              const checked = selected.includes(item.id)
              return (
                <button
                  type="button"
                  key={item.id}
                  className={checked ? "selected" : ""}
                  onClick={() =>
                    setSelected((current) =>
                      checked
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id],
                    )
                  }
                >
                  <span className="checkbox">
                    {checked && <Check size={16} />}
                  </span>
                  <ItemThumb item={item} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.locationPath}</small>
                  </span>
                </button>
              )
            })}
            {!visible.length && (
              <div className="empty-state empty-state--compact">
                <Search size={26} />
                <h2>Barang tidak ditemukan.</h2>
              </div>
            )}
          </div>
          {submitted && !selected.length && (
            <span className="field__message field__message--error">
              <AlertTriangle size={14} /> Pilih minimal satu barang.
            </span>
          )}
        </section>

        <section className="form-section">
          <label className="toggle-row">
            <span>
              <strong>Pengingat</strong>
              <small>Kirim notifikasi sebelum aktivitas.</small>
            </span>
            <input
              type="checkbox"
              checked={reminder.enabled}
              onChange={(event) =>
                setReminder((current) => ({
                  ...current,
                  enabled: event.target.checked,
                }))
              }
            />
            <i />
          </label>
          {reminder.enabled && (
            <>
              <div className="day-chips">
                {dayOptions.map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={reminder.days.includes(day) ? "active" : ""}
                    onClick={() =>
                      setReminder((current) => ({
                        ...current,
                        days: current.days.includes(day)
                          ? current.days.filter((value) => value !== day)
                          : [...current.days, day],
                      }))
                    }
                  >
                    {day}
                  </button>
                ))}
              </div>
              <label className="field">
                <span className="field__label">Waktu</span>
                <span className="field__control">
                  <Clock3 size={18} />
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(event) =>
                      setReminder((current) => ({
                        ...current,
                        time: event.target.value,
                      }))
                    }
                  />
                </span>
              </label>
            </>
          )}
        </section>
        <div className="form-actions">
          <ActionButton type="button" variant="secondary" onClick={onCancel}>
            Batal
          </ActionButton>
          <ActionButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </ActionButton>
        </div>
      </form>
    </main>
  )
}

export function GoodsCheckScreen({
  quickSet,
  items,
  onNavigate,
  onItem,
  onBorrow,
  onComplete,
}: {
  quickSet: QuickSet
  items: InventoryItem[]
  onNavigate: (screen: ScreenName) => void
  onItem: (item: InventoryItem) => void
  onBorrow: (item: InventoryItem) => Promise<void>
  onComplete: (checkedIds: string[], ignoredIds: string[]) => Promise<void>
}) {
  const setItems = quickSet.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as InventoryItem[]
  const [checked, setChecked] = useState<string[]>([])
  const [ignored, setIgnored] = useState<string[]>([])
  const [result, setResult] = useState<"checking" | "success" | "warning">(
    "checking",
  )
  const unresolved = setItems.filter(
    (item) => !checked.includes(item.id) && !ignored.includes(item.id),
  )

  if (result === "success") {
    return (
      <main className="screen app-page">
        <div className="result-state result-state--success">
          <span className="result-state__icon">
            <Check size={42} />
          </span>
          <p className="eyebrow">Goods Check selesai</p>
          <h1>Semua barang siap!</h1>
          <p>{quickSet.name} sudah diperiksa dan siap untuk berangkat.</p>
          <ActionButton onClick={() => onNavigate("dashboard")}>
            Kembali ke Beranda
          </ActionButton>
        </div>
      </main>
    )
  }

  if (result === "warning") {
    return (
      <main className="screen app-page">
        <div className="goods-warning">
          <span className="result-state__icon">
            <AlertTriangle size={38} />
          </span>
          <p className="eyebrow">Belum lengkap</p>
          <h1>{unresolved.length} barang belum dicek</h1>
          <p>Putuskan tindakan untuk setiap barang sebelum berangkat.</p>
          <div className="unchecked-actions">
            {unresolved.map((item) => (
              <ItemRow
                item={item}
                key={item.id}
                actions={
                  <div className="unchecked-actions__buttons">
                    <button onClick={() => onItem(item)}>Lihat lokasi</button>
                    <button
                      onClick={async () => {
                        await onBorrow(item)
                        setIgnored((current) => [...current, item.id])
                      }}
                    >
                      Tandai dipinjam
                    </button>
                    <button
                      onClick={() =>
                        setIgnored((current) => [...current, item.id])
                      }
                    >
                      Abaikan
                    </button>
                  </div>
                }
              />
            ))}
          </div>
          <div className="result-actions">
            <ActionButton
              variant="secondary"
              onClick={() => setResult("checking")}
            >
              Cek ulang
            </ActionButton>
            <ActionButton
              onClick={async () => {
                await onComplete(checked, ignored)
                onNavigate("dashboard")
              }}
            >
              Tetap berangkat
            </ActionButton>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="screen app-page goods-check">
      <header className="app-header">
        <div>
          <p className="eyebrow">{quickSet.name}</p>
          <h1>Goods Check</h1>
        </div>
        <span className="date-chip">
          {checked.length}/{setItems.length}
        </span>
      </header>
      <div className="app-page__content goods-check-content">
        {!setItems.length ? (
          <section className="empty-state">
            <ClipboardCheck size={32} />
            <h2>Belum ada barang untuk dicek.</h2>
            <p>Tambahkan barang melalui Quick Set terlebih dahulu.</p>
            <ActionButton onClick={() => onNavigate("quicksets")}>
              Buka Quick Sets
            </ActionButton>
          </section>
        ) : (
          <>
            <section className="check-progress">
              <div>
                <span>Perlengkapan diperiksa</span>
                <strong>
                  {Math.round(
                    (checked.length / Math.max(setItems.length, 1)) * 100,
                  )}
                  %
                </strong>
              </div>
              <div className="progress progress--large">
                <span
                  style={{
                    width: `${(checked.length / Math.max(setItems.length, 1)) * 100}%`,
                  }}
                />
              </div>
            </section>
            <div className="check-list">
              {setItems.map((item) => {
                const isChecked = checked.includes(item.id)
                return (
                  <button
                    key={item.id}
                    className={`check-row ${
                      isChecked ? "check-row--checked" : ""
                    }`}
                    onClick={() =>
                      setChecked((current) =>
                        isChecked
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id],
                      )
                    }
                  >
                    <span className="check-row__control">
                      {isChecked && <Check size={18} />}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        <MapPin size={13} /> {item.locationPath}
                      </small>
                    </span>
                    <StatusBadge status={item.status} />
                  </button>
                )
              })}
            </div>
            <ActionButton
              onClick={async () => {
                if (checked.length === setItems.length) {
                  await onComplete(checked, [])
                  setResult("success")
                } else setResult("warning")
              }}
            >
              Selesai cek
            </ActionButton>
          </>
        )}
      </div>
      <AppTabs active="Goods Check" onNavigate={onNavigate} />
    </main>
  )
}

const notificationIcon = (type: AppNotification["type"]) => {
  if (type === "reminder") return Clock3
  if (type === "unchecked") return ClipboardCheck
  if (type === "borrowed") return WalletCards
  return XCircle
}

export function NotificationsScreen({
  notifications,
  loading,
  error,
  onRetry,
  onNavigate,
  onRead,
  onReadAll,
}: {
  notifications: AppNotification[]
  loading: boolean
  error: string
  onRetry: () => void
  onNavigate: (screen: ScreenName) => void
  onRead: (notification: AppNotification) => void
  onReadAll: () => void
}) {
  const groups = useMemo(() => {
    const today = new Date().toDateString()
    return {
      today: notifications.filter(
        (item) => new Date(item.createdAt).toDateString() === today,
      ),
      previous: notifications.filter(
        (item) => new Date(item.createdAt).toDateString() !== today,
      ),
    }
  }, [notifications])

  const renderGroup = (title: string, list: AppNotification[]) => {
    if (!list.length) return null
    return (
      <section className="notification-group">
        <h2>{title}</h2>
        <div className="notification-list">
          {list.map((notification) => {
            const Icon = notificationIcon(notification.type)
            return (
              <button
                className={`notification-row notification-row--${notification.type} ${
                  notification.read ? "" : "unread"
                }`}
                key={notification.id}
                onClick={() => onRead(notification)}
              >
                <span className="notification-row__icon">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{notification.title}</strong>
                  <small>{notification.body}</small>
                  <time>
                    {new Intl.DateTimeFormat("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(notification.createdAt))}
                  </time>
                </span>
                {!notification.read && <i aria-label="Belum dibaca" />}
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <main className="screen app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Pembaruan</p>
          <h1>Notifikasi</h1>
        </div>
        {notifications.some((item) => !item.read) && (
          <ActionButton variant="ghost" onClick={onReadAll}>
            Tandai semua dibaca
          </ActionButton>
        )}
      </header>
      <div className="app-page__content">
        {loading ? (
          <div className="collection-loading">
            <div className="skeleton skeleton--item" />
            <div className="skeleton skeleton--item" />
          </div>
        ) : error ? (
          <section className="empty-state empty-state--error">
            <AlertTriangle size={28} />
            <h2>Notifikasi gagal dimuat</h2>
            <p>Koneksi bermasalah. Coba lagi.</p>
            <ActionButton variant="secondary" onClick={onRetry}>
              Coba lagi
            </ActionButton>
          </section>
        ) : notifications.length ? (
          <>
            {renderGroup("Hari ini", groups.today)}
            {renderGroup("Sebelumnya", groups.previous)}
          </>
        ) : (
          <section className="empty-state">
            <Bell size={32} />
            <h2>Belum ada notifikasi.</h2>
            <p>Pengingat dan peringatan akan muncul di sini.</p>
          </section>
        )}
      </div>
      <AppTabs active="Beranda" onNavigate={onNavigate} />
    </main>
  )
}
