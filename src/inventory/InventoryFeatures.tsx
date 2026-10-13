import { ChangeEvent, FormEvent, ReactNode, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Folder,
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
import type {
  InventoryInput,
  InventoryItem,
  InventoryStatus,
  LocationNode,
  LocationType,
} from "../lib/inventory"

type ScreenName = "dashboard" | "inventory" | "quicksets" | "goodscheck" | "profile" | "locations" | "item-form" | "item-detail"

const categories = [
  "Elektronik",
  "Aksesori",
  "Dokumen",
  "Perlengkapan",
  "Pakaian",
  "Lainnya",
]

const statusLabels: Record<InventoryStatus, string> = {
  available: "Tersedia",
  borrowed: "Dipinjam",
  unavailable: "Tidak Tersedia",
}

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

function StatusBadge({ status }: { status: InventoryStatus }) {
  const Icon =
    status === "available"
      ? CheckCircle2
      : status === "borrowed"
        ? Clock3
        : XCircle
  return (
    <span className={`status status--${status}`}>
      <Icon size={14} strokeWidth={2} />
      {statusLabels[status]}
    </span>
  )
}

function ItemVisual({
  item,
  className = "",
}: {
  item: Pick<InventoryItem, "image" | "category" | "icon">
  className?: string
}) {
  if (item.image) return <img className={className} src={item.image} alt="" />
  const Icon =
    item.icon === "document" ? WalletCards : item.icon === "bag" ? Layers3 : Box
  return (
    <span className={`item-visual ${className}`}>
      <Icon size={32} />
    </span>
  )
}

function InventoryCard({
  item,
  onClick,
}: {
  item: InventoryItem
  onClick?: () => void
}) {
  const content = (
    <>
      <ItemVisual item={item} className="item-card__image" />
      <span className="item-card__body">
        <span className="item-card__topline">
          <strong>{item.name}</strong>
          <ChevronRight size={18} />
        </span>
        <span className="item-card__category">
          {item.category} · {item.quantity} barang
        </span>
        <span className="item-card__location">
          <MapPin size={14} />
          {item.locationPath || "Lokasi belum dipilih"}
        </span>
        <StatusBadge status={item.status} />
      </span>
    </>
  )
  if (onClick)
    return (
      <button className="item-card" onClick={onClick}>
        {content}
      </button>
    )
  return <div className="item-card">{content}</div>
}

function InlineError({ children }: { children?: string }) {
  if (!children) return null
  return (
    <span className="field__message field__message--error">
      <AlertTriangle size={14} />
      {children}
    </span>
  )
}

function InventoryTabBar({
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

function LoadingItems() {
  return (
    <div className="collection-loading">
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--item" />
      <div className="skeleton skeleton--item" />
      <div className="skeleton skeleton--item" />
    </div>
  )
}

function LocationHierarchy({
  locations,
  items,
  path,
  onPathChange,
  onChoose,
  compact = false,
}: {
  locations: LocationNode[]
  items: InventoryItem[]
  path: string[]
  onPathChange: (path: string[]) => void
  onChoose?: (location: LocationNode, path: string) => void
  compact?: boolean
}) {
  const parentId = path.at(-1) || null
  const children = locations.filter(
    (location) => location.parentId === parentId,
  )
  const pathNodes = path
    .map((id) => locations.find((location) => location.id === id))
    .filter(Boolean) as LocationNode[]
  const current = pathNodes.at(-1)
  const breadcrumb = pathNodes.map((location) => location.name).join(" › ")
  const itemsHere = current
    ? items.filter((item) => item.locationId === current.id)
    : []

  const itemCount = (location: LocationNode) =>
    items.filter((item) => item.locationPath.includes(location.name)).length

  return (
    <div
      className={`location-browser ${
        compact ? "location-browser--compact" : ""
      }`}
    >
      <div className="location-breadcrumb">
        <button onClick={() => onPathChange([])}>Semua lokasi</button>
        {pathNodes.map((node, index) => (
          <span key={node.id}>
            <ChevronRight size={14} />
            <button onClick={() => onPathChange(path.slice(0, index + 1))}>
              {node.name}
            </button>
          </span>
        ))}
      </div>

      {current && onChoose && (
        <button
          className="choose-location"
          onClick={() => onChoose(current, breadcrumb)}
        >
          <Check size={18} />
          Pilih {breadcrumb}
        </button>
      )}

      {children.length ? (
        <div className="location-browser__rows">
          {children.map((location) => (
            <button
              className="location-browser__row"
              key={location.id}
              onClick={() => onPathChange([...path, location.id])}
            >
              <span className="location-card__icon">
                <Folder size={22} />
              </span>
              <span>
                <strong>{location.name}</strong>
                <small>
                  {location.level} · {itemCount(location)} barang
                </small>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      ) : current ? (
        <div className="location-items">
          <p className="field__label">Barang di lokasi ini</p>
          {itemsHere.length ? (
            itemsHere.map((item) => <InventoryCard item={item} key={item.id} />)
          ) : (
            <div className="empty-state empty-state--compact">
              <PackageCheck size={28} />
              <h2>Belum ada barang di lokasi ini.</h2>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function InventoryScreen({
  items,
  locations,
  loading,
  error,
  onReload,
  onNavigate,
  onAdd,
  onSelect,
}: {
  items: InventoryItem[]
  locations: LocationNode[]
  loading: boolean
  error: string
  onReload: () => void
  onNavigate: (screen: ScreenName) => void
  onAdd: () => void
  onSelect: (item: InventoryItem) => void
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("Semua")
  const visible = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      (category === "Semua" || item.category === category),
  )

  return (
    <main className="screen app-page inventory-screen">
      <header className="app-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Inventaris</h1>
        </div>
        <div className="inventory-actions">
          <ActionButton
            className="desktop-action"
            icon={<Plus size={18} />}
            onClick={onAdd}
          >
            Tambah Barang
          </ActionButton>
          <button
            className="button button--ghost button--icon"
            aria-label="Buka Specific Location"
            onClick={() => onNavigate("locations")}
          >
            <MapPin size={22} />
          </button>
        </div>
      </header>
      <div className="app-page__content">
        <div className="inventory-tools">
          <label className="field">
            <span className="field__label">Cari barang</span>
            <span className="field__control">
              <span className="field__icon">
                <Search size={20} />
              </span>
              <input
                value={query}
                placeholder="KTM, laptop, dompet..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
          </label>
          <label className="field">
            <span className="field__label">Kategori</span>
            <span className="field__control select-control">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Semua</option>
                {categories.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown size={18} />
            </span>
          </label>
        </div>
        {loading ? (
          <LoadingItems />
        ) : error ? (
          <section className="empty-state empty-state--error">
            <AlertTriangle size={28} />
            <h2>Inventaris gagal dimuat</h2>
            <p>Koneksi bermasalah. Coba lagi.</p>
            <ActionButton variant="secondary" onClick={onReload}>
              Coba lagi
            </ActionButton>
          </section>
        ) : visible.length ? (
          <div className="inventory-layout inventory-layout--live">
            <div className="inventory-list">
              {visible.map((item) => (
                <InventoryCard
                  item={item}
                  key={item.id}
                  onClick={() => onSelect(item)}
                />
              ))}
            </div>
            <aside className="inventory-location-overview">
              <p className="eyebrow">Specific Location</p>
              <h2>Ringkasan lokasi</h2>
              <LocationHierarchy
                compact
                locations={locations}
                items={items}
                path={[]}
                onPathChange={() => onNavigate("locations")}
              />
            </aside>
          </div>
        ) : (
          <section className="empty-state">
            <Box size={32} />
            <h2>Belum ada barang</h2>
            <p>Tambahkan barang pertama ke Inventaris Anda.</p>
            <ActionButton icon={<Plus size={18} />} onClick={onAdd}>
              Tambah Barang
            </ActionButton>
          </section>
        )}
      </div>
      <button
        className="button button--primary button--icon fab"
        aria-label="Tambah Barang"
        onClick={onAdd}
      >
        <Plus size={24} />
      </button>
      <InventoryTabBar active="Inventaris" onNavigate={onNavigate} />
    </main>
  )
}

type FormErrors = Partial<Record<"photo" | "name" | "borrowedBy" | "location", string>>

export function ItemFormScreen({
  item,
  items,
  locations,
  onCancel,
  onSave,
}: {
  item?: InventoryItem
  items: InventoryItem[]
  locations: LocationNode[]
  onCancel: () => void
  onSave: (input: InventoryInput, id?: string) => Promise<void>
}) {
  const [form, setForm] = useState<InventoryInput>({
    name: item?.name || "",
    category: item?.category || "Elektronik",
    quantity: item?.quantity || 1,
    status: item?.status || "available",
    borrowedBy: item?.borrowedBy || "",
    locationId: item?.locationId || "",
    locationPath: item?.locationPath || "",
    locationType: item?.locationType || "Disimpan",
    notes: item?.notes || "",
    image: item?.image || "",
    icon: item?.icon || "box",
    quickSets: item?.quickSets || [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [locationPath, setLocationPath] = useState<string[]>([])

  const update = <K extends keyof InventoryInput,>(
    key: K,
    value: InventoryInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }))

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2_000_000) {
      setErrors((current) => ({
        ...current,
        photo: "Ukuran foto maksimal 2 MB.",
      }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      update("image", String(reader.result))
      setErrors((current) => ({ ...current, photo: "" }))
    }
    reader.readAsDataURL(file)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = "Nama barang wajib diisi."
    if (form.status === "borrowed" && !form.borrowedBy.trim())
      nextErrors.borrowedBy = "Nama peminjam wajib diisi."
    if (!form.locationId) nextErrors.location = "Lokasi wajib dipilih."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      await onSave(form, item?.id)
    } finally {
      setSaving(false)
    }
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
          <p className="eyebrow">Inventaris</p>
          <h1>{item ? "Edit Barang" : "Tambah Barang"}</h1>
        </div>
      </header>
      <form className="item-form" onSubmit={submit} noValidate>
        <section className="form-section">
          <span className="field__label">Foto barang</span>
          <div className="photo-picker">
            {form.image ? (
              <img src={form.image} alt="Pratinjau barang" />
            ) : (
              <span>
                <Box size={36} />
              </span>
            )}
            <div>
              <label className="button button--secondary upload-button">
                <Plus size={18} />
                Unggah foto
                <input type="file" accept="image/*" onChange={upload} />
              </label>
              <p>JPG atau PNG, maksimal 2 MB.</p>
            </div>
          </div>
          <InlineError>{errors.photo}</InlineError>
          <div className="icon-picker">
            <span>Atau pilih ikon</span>
            {[
              { value: "box", Icon: Box },
              { value: "document", Icon: WalletCards },
              { value: "bag", Icon: Layers3 },
            ].map(({ value, Icon }) => (
              <button
                type="button"
                key={value}
                className={form.icon === value ? "active" : ""}
                onClick={() => {
                  update("icon", value)
                  update("image", "")
                }}
              >
                <Icon size={22} />
              </button>
            ))}
          </div>
        </section>

        <section className="form-section form-fields">
          <label className="field">
            <span className="field__label">Nama barang</span>
            <span
              className={`field__control ${
                errors.name ? "field__control--error" : ""
              }`}
            >
              <input
                value={form.name}
                placeholder="Contoh: KTM"
                onChange={(event) => update("name", event.target.value)}
              />
            </span>
            <InlineError>{errors.name}</InlineError>
          </label>
          <label className="field">
            <span className="field__label">Kategori</span>
            <span className="field__control select-control">
              <select
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <ChevronDown size={18} />
            </span>
          </label>
          <div className="field">
            <span className="field__label">Jumlah</span>
            <div className="stepper">
              <button
                type="button"
                disabled={form.quantity <= 1}
                onClick={() =>
                  update("quantity", Math.max(1, form.quantity - 1))
                }
              >
                <span aria-hidden="true">−</span>
              </button>
              <strong>{form.quantity}</strong>
              <button
                type="button"
                onClick={() => update("quantity", form.quantity + 1)}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          <div className="field">
            <span className="field__label">Status</span>
            <div className="segmented">
              {([
                "available",
                "borrowed",
                "unavailable",
              ] as InventoryStatus[]).map((status) => (
                <button
                  type="button"
                  key={status}
                  className={form.status === status ? "active" : ""}
                  onClick={() => update("status", status)}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          </div>
          {form.status === "borrowed" && (
            <label className="field">
              <span className="field__label">Dipinjam oleh</span>
              <span
                className={`field__control ${
                  errors.borrowedBy ? "field__control--error" : ""
                }`}
              >
                <input
                  value={form.borrowedBy}
                  placeholder="Nama peminjam"
                  onChange={(event) => update("borrowedBy", event.target.value)}
                />
              </span>
              <InlineError>{errors.borrowedBy}</InlineError>
            </label>
          )}
          <div className="field">
            <span className="field__label">Lokasi</span>
            <button
              type="button"
              className={`location-field ${
                errors.location ? "field__control--error" : ""
              }`}
              onClick={() => setLocationOpen(true)}
            >
              <MapPin size={20} />
              <span>{form.locationPath || "Pilih Specific Location"}</span>
              <ChevronRight size={18} />
            </button>
            <InlineError>{errors.location}</InlineError>
          </div>
          <label className="field">
            <span className="field__label">Catatan</span>
            <textarea
              value={form.notes}
              placeholder="Tambahkan catatan opsional"
              onChange={(event) => update("notes", event.target.value)}
            />
          </label>
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

      {locationOpen && (
        <div className="sheet-layer" role="presentation">
          <section className="bottom-sheet location-picker-sheet" role="dialog">
            <span className="bottom-sheet__handle" />
            <div className="section-heading">
              <div>
                <p className="eyebrow">Specific Location</p>
                <h2>Pilih lokasi</h2>
              </div>
              <button
                className="button button--ghost button--icon"
                onClick={() => setLocationOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <LocationHierarchy
              locations={locations}
              items={items}
              path={locationPath}
              onPathChange={setLocationPath}
              onChoose={(location, pathLabel) => {
                update("locationId", location.id)
                update("locationPath", pathLabel)
                update("locationType", location.type)
                setErrors((current) => ({ ...current, location: "" }))
                setLocationOpen(false)
              }}
            />
          </section>
        </div>
      )}
    </main>
  )
}

function LocationUpdateSheet({
  item,
  items,
  locations,
  onClose,
  onSave,
}: {
  item: InventoryItem
  items: InventoryItem[]
  locations: LocationNode[]
  onClose: () => void
  onSave: (location: LocationNode, path: string) => Promise<boolean>
}) {
  const [path, setPath] = useState<string[]>([])
  const [selected, setSelected] = useState<{
    location: LocationNode
    path: string
  }>()
  const [saving, setSaving] = useState(false)
  const recentPaths = [
    item.locationPath,
    ...item.history.slice(0, 2).map((entry) => entry.from),
  ].filter((value, index, array) => value && array.indexOf(value) === index)

  const selectRecent = (recent: string) => {
    const lastName = recent.split(" › ").at(-1)
    const location = locations.find((node) => node.name === lastName)
    if (location) setSelected({ location, path: recent })
  }

  return (
    <div className="sheet-layer" role="presentation">
      <section className="bottom-sheet location-update-sheet" role="dialog">
        <span className="bottom-sheet__handle" />
        <div className="section-heading">
          <div>
            <p className="eyebrow">Perbarui</p>
            <h2>Specific Location</h2>
          </div>
          <button
            className="button button--ghost button--icon"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <div className="current-location">
          <span>Lokasi saat ini</span>
          <strong>
            <MapPin size={18} /> {item.locationPath}
          </strong>
        </div>
        <div>
          <p className="field__label">Lokasi terakhir dipakai</p>
          <div className="recent-location-chips">
            {recentPaths.map((recent) => (
              <button
                key={recent}
                className={selected?.path === recent ? "active" : ""}
                onClick={() => selectRecent(recent)}
              >
                {recent}
              </button>
            ))}
          </div>
        </div>
        <LocationHierarchy
          compact
          locations={locations}
          items={items}
          path={path}
          onPathChange={setPath}
          onChoose={(location, pathLabel) =>
            setSelected({ location, path: pathLabel })
          }
        />
        <ActionButton
          disabled={!selected || saving}
          onClick={async () => {
            if (!selected) return
            setSaving(true)
            const success = await onSave(selected.location, selected.path)
            setSaving(false)
            if (success) onClose()
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Lokasi"}
        </ActionButton>
      </section>
    </div>
  )
}

export function ItemDetailScreen({
  item,
  items,
  locations,
  onBack,
  onEdit,
  onDelete,
  onUpdateLocation,
}: {
  item: InventoryItem
  items: InventoryItem[]
  locations: LocationNode[]
  onBack: () => void
  onEdit: () => void
  onDelete: () => Promise<boolean>
  onUpdateLocation: (location: LocationNode, path: string) => Promise<boolean>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <main className="screen item-detail-screen">
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
              <button onClick={onEdit}>Edit</button>
              <button className="danger" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="item-detail-content">
        <ItemVisual item={item} className="item-detail-photo" />
        <section className="item-detail-heading">
          <div>
            <p className="eyebrow">{item.category}</p>
            <h1>{item.name}</h1>
            <p>{item.quantity} barang</p>
          </div>
          <StatusBadge status={item.status} />
        </section>
        {item.status === "borrowed" && item.borrowedBy && (
          <div className="borrowed-note">
            <Clock3 size={18} />
            Dipinjam oleh {item.borrowedBy}
          </div>
        )}
        <section className="detail-location-card">
          <div>
            <span>Specific Location</span>
            <strong>
              <MapPin size={20} /> {item.locationPath}
            </strong>
          </div>
          <span className="location-type">{item.locationType}</span>
        </section>
        <ActionButton
          icon={<MapPin size={18} />}
          onClick={() => setLocationOpen(true)}
        >
          Perbarui Lokasi
        </ActionButton>
        <section className="detail-section">
          <h2>Riwayat Lokasi</h2>
          {item.history.length ? (
            <div className="location-timeline">
              {item.history.map((entry) => (
                <div key={entry.id}>
                  <span />
                  <div>
                    <time>
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(entry.changedAt))}
                    </time>
                    <p>
                      {entry.from} <strong>→</strong> {entry.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted-copy">Belum ada pembaruan lokasi manual.</p>
          )}
        </section>
        <section className="detail-section">
          <h2>Termasuk dalam Quick Set</h2>
          <div className="quick-set-chips">
            {item.quickSets.length ? (
              item.quickSets.map((set) => <span key={set}>{set}</span>)
            ) : (
              <p className="muted-copy">Belum masuk Quick Set.</p>
            )}
          </div>
        </section>
        {item.notes && (
          <section className="detail-section">
            <h2>Catatan</h2>
            <p>{item.notes}</p>
          </section>
        )}
      </div>
      {locationOpen && (
        <LocationUpdateSheet
          item={item}
          items={items}
          locations={locations}
          onClose={() => setLocationOpen(false)}
          onSave={onUpdateLocation}
        />
      )}
      {deleteOpen && (
        <div className="dialog-layer">
          <section className="confirm-dialog" role="dialog">
            <span className="confirm-dialog__icon">
              <Trash2 size={24} />
            </span>
            <h2>Hapus barang?</h2>
            <p>{item.name} akan dihapus permanen dari Inventaris.</p>
            <div className="confirm-dialog__actions">
              <ActionButton
                variant="secondary"
                onClick={() => setDeleteOpen(false)}
              >
                Batal
              </ActionButton>
              <ActionButton
                variant="destructive"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true)
                  const success = await onDelete()
                  if (!success) setDeleting(false)
                }}
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </ActionButton>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export function LocationsScreen({
  items,
  locations,
  loading,
  error,
  onRetry,
  onNavigate,
  onAddLocation,
}: {
  items: InventoryItem[]
  locations: LocationNode[]
  loading: boolean
  error: string
  onRetry: () => void
  onNavigate: (screen: ScreenName) => void
  onAddLocation: (input: Omit<LocationNode, "id">) => Promise<boolean>
}) {
  const [path, setPath] = useState<string[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<LocationType>("Disimpan")
  const [saving, setSaving] = useState(false)
  const currentLocation = locations.find(
    (location) => location.id === path.at(-1),
  )
  const atDeepestLevel = path.length >= 4
  const parent = atDeepestLevel
    ? currentLocation?.parentId || null
    : path.at(-1) || null
  const level = (["Tempat", "Ruangan", "Penyimpanan", "Posisi spesifik"][
    atDeepestLevel ? 3 : Math.min(path.length, 3)
  ] || "Posisi spesifik") as LocationNode["level"]

  return (
    <main className="screen app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Penyimpanan</p>
          <h1>Specific Location</h1>
        </div>
        <button
          className="button button--secondary"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={18} /> Tambah lokasi
        </button>
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
            <h2>Specific Location gagal dimuat</h2>
            <p>Koneksi bermasalah. Coba lagi.</p>
            <ActionButton variant="secondary" onClick={onRetry}>
              Coba lagi
            </ActionButton>
          </section>
        ) : locations.length ? (
          <LocationHierarchy
            locations={locations}
            items={items}
            path={path}
            onPathChange={setPath}
          />
        ) : (
          <section className="empty-state">
            <Folder size={32} />
            <h2>Belum ada lokasi.</h2>
            <p>Tambahkan lokasi pertama untuk mulai mengatur barang.</p>
            <ActionButton
              icon={<Plus size={18} />}
              onClick={() => setAddOpen(true)}
            >
              Tambah lokasi
            </ActionButton>
          </section>
        )}
      </div>
      <InventoryTabBar active="Inventaris" onNavigate={onNavigate} />
      {addOpen && (
        <div className="sheet-layer">
          <section className="bottom-sheet" role="dialog">
            <span className="bottom-sheet__handle" />
            <div className="section-heading">
              <div>
                <p className="eyebrow">{level}</p>
                <h2>Tambah lokasi</h2>
              </div>
              <button
                className="button button--ghost button--icon"
                onClick={() => setAddOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <div className="sheet-content">
              <label className="field">
                <span className="field__label">Nama lokasi</span>
                <span className="field__control">
                  <input
                    value={name}
                    placeholder="Contoh: Laci 2"
                    onChange={(event) => setName(event.target.value)}
                  />
                </span>
              </label>
              <div className="field">
                <span className="field__label">Tipe lokasi</span>
                <div className="segmented">
                  {(["Disimpan", "Dibawa"] as LocationType[]).map((option) => (
                    <button
                      key={option}
                      className={type === option ? "active" : ""}
                      onClick={() => setType(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <ActionButton
                disabled={!name.trim() || saving}
                onClick={async () => {
                  setSaving(true)
                  const success = await onAddLocation({
                    name: name.trim(),
                    parentId: parent,
                    level,
                    type,
                  })
                  setSaving(false)
                  if (!success) return
                  setName("")
                  setAddOpen(false)
                }}
              >
                {saving ? "Menyimpan..." : "Tambah lokasi"}
              </ActionButton>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
