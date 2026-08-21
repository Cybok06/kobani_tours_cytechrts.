import { useEffect, useMemo, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
import { ApiError, staffApi, type StaffRole, type StaffUser } from "./api"

type Tab = "users" | "roles" | "permissions"
const errorText = (error: unknown) => error instanceof ApiError ? error.code.replaceAll("_", " ") : "The request could not be completed."
const permissionLabel = (value: string) => value.replaceAll("_", " ").replace(".", " · ").replace(/\b\w/g, (x) => x.toUpperCase())

export default function AdminStaffRolesPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [tab, setTab] = useState<Tab>("users")
  const [staff, setStaff] = useState<StaffUser[]>([])
  const [roles, setRoles] = useState<StaffRole[]>([])
  const [permissions, setPermissions] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [staffModal, setStaffModal] = useState(false)
  const [roleModal, setRoleModal] = useState<StaffRole | "new" | null>(null)

  const load = async () => {
    setLoading(true); setError("")
    try {
      const [usersResult, rolesResult, permissionsResult] = await Promise.all([staffApi.list(), staffApi.roles(), staffApi.permissions()])
      setStaff(usersResult.data.staff); setRoles(rolesResult.data.roles); setPermissions(permissionsResult.data.permissions)
    } catch (err) { setError(errorText(err)) } finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3500) }
  const shown = useMemo(() => staff.filter((user) => `${user.full_name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())), [staff, query])

  const StaffModal = () => {
    const [form, setForm] = useState({ full_name: "", email: "", role_id: roles[0]?.id || "", password: "" })
    const [busy, setBusy] = useState(false); const [modalError, setModalError] = useState("")
    const submit = async () => { setBusy(true); setModalError(""); try { await staffApi.create(form); setStaffModal(false); await load(); flash("Staff account created. They can now use the Admin Login form.") } catch (err) { setModalError(errorText(err)) } finally { setBusy(false) } }
    return <div className="fixed inset-0 z-[90] bg-black/60 p-4 grid place-items-center"><div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"><header className="bg-[#0B0B0B] text-white p-5 flex justify-between"><div><p className="eyebrow">Access control</p><h2 className="font-serif text-2xl font-bold">Create Staff User</h2></div><button onClick={() => setStaffModal(false)}>×</button></header><div className="p-6 space-y-4">
      <label className="block text-sm">Full name<input className="admin-input w-full mt-1" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></label>
      <label className="block text-sm">Work email<input type="email" className="admin-input w-full mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label className="block text-sm">Role<select className="admin-input w-full mt-1" value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })}>{roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}</select></label>
      <label className="block text-sm">Temporary password<input type="password" className="admin-input w-full mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><small className="block text-[#777] mt-1">At least 10 characters with uppercase, lowercase, number and symbol.</small></label>
      {modalError && <p className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{modalError}</p>}
      <button disabled={busy || !form.full_name || !form.email || !form.role_id || !form.password} onClick={() => void submit()} className="admin-gold w-full disabled:opacity-50">{busy ? "Creating…" : "Create Staff Account"}</button>
    </div></div></div>
  }

  const RoleModal = ({ value }: { value: StaffRole | "new" }) => {
    const existing = value === "new" ? null : value
    const [name, setName] = useState(existing?.name || ""); const [description, setDescription] = useState(existing?.description || ""); const [selected, setSelected] = useState<string[]>(existing?.permissions || []); const [busy, setBusy] = useState(false); const [modalError, setModalError] = useState("")
    const save = async () => { setBusy(true); setModalError(""); try { if (existing) await staffApi.updateRole(existing.id, { name, description, permissions: selected }); else await staffApi.createRole({ name, description, permissions: selected }); setRoleModal(null); await load(); flash(existing ? "Role permissions updated." : "New role created.") } catch (err) { setModalError(errorText(err)) } finally { setBusy(false) } }
    const grouped = Object.entries(permissions.reduce<Record<string, string[]>>((all, permission) => { const group = permission.split(".")[0]; (all[group] ||= []).push(permission); return all }, {}))
    return <div className="fixed inset-0 z-[90] bg-black/60 p-4 grid place-items-center"><div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"><header className="bg-[#0B0B0B] text-white p-5 flex justify-between sticky top-0"><div><p className="eyebrow">Role management</p><h2 className="font-serif text-2xl font-bold">{existing ? `Edit ${existing.name}` : "Create Role"}</h2></div><button onClick={() => setRoleModal(null)}>×</button></header><div className="p-6 space-y-5"><div className="grid sm:grid-cols-2 gap-4"><label className="text-sm">Role name<input disabled={!!existing?.slug && existing.slug === "super_admin"} className="admin-input w-full mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label><label className="text-sm">Description<input className="admin-input w-full mt-1" value={description} onChange={(e) => setDescription(e.target.value)} /></label></div><div><h3 className="font-bold">Permissions</h3><p className="text-sm text-[#777]">Only selected capabilities will be available to staff assigned to this role.</p></div><div className="grid sm:grid-cols-2 gap-3">{grouped.map(([group, values]) => <section className="border rounded-xl p-4" key={group}><b className="capitalize">{group.replaceAll("_", " ")}</b><div className="mt-2 space-y-2">{values.map((permission) => <label className="flex gap-2 text-sm" key={permission}><input type="checkbox" checked={selected.includes(permission)} disabled={existing?.slug === "super_admin"} onChange={(e) => setSelected(e.target.checked ? [...selected, permission] : selected.filter((item) => item !== permission))} />{permissionLabel(permission)}</label>)}</div></section>)}</div>{modalError && <p className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{modalError}</p>}<button disabled={busy || !name} onClick={() => void save()} className="admin-gold w-full disabled:opacity-50">{busy ? "Saving…" : "Save Role and Permissions"}</button></div></div></div>
  }

  return <AdminShell title="Staff Users & Roles" active="Users & Roles" onNavigate={onNavigate}>
    {notice && <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-black text-white rounded-xl px-5 py-3 text-sm">{notice}</div>}
    <div className="flex justify-between items-end gap-4 flex-wrap"><div><p className="eyebrow">Access control</p><h1 className="page-title">Staff Users & Roles</h1><p className="sub">Create administrator accounts and control exactly what each role can access.</p></div><div className="flex gap-2"><button onClick={() => void load()} className="admin-outline">Refresh</button>{tab === "users" ? <button onClick={() => setStaffModal(true)} className="admin-gold">+ Add Staff</button> : <button onClick={() => setRoleModal("new")} className="admin-gold">+ Create Role</button>}</div></div>
    <div className="mt-6 bg-white border rounded-2xl p-2 flex">{(["users", "roles", "permissions"] as Tab[]).map((value) => <button key={value} onClick={() => setTab(value)} className={`flex-1 rounded-xl py-3 font-bold capitalize ${tab === value ? "bg-black text-white" : "text-[#777]"}`}>{value}</button>)}</div>
    {error && <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}
    {tab === "users" && <div className="admin-table-card mt-5"><div className="table-top flex justify-between gap-3"><input className="admin-input max-w-sm" placeholder="Search staff…" value={query} onChange={(e) => setQuery(e.target.value)} /><span>{shown.length} users</span></div><div className="overflow-x-auto"><table className="admin-table min-w-[900px]"><thead><tr>{["Staff member", "Role", "Status", "Last login", "Role assignment", "Account"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={6}>Loading…</td></tr> : shown.length === 0 ? <tr><td colSpan={6}>No staff users have been created.</td></tr> : shown.map((user) => <tr key={user.id}><td><b className="block">{user.full_name}</b><small>{user.email}</small></td><td>{user.role}</td><td><span className={`pill ${user.status === "active" ? "success" : "danger"}`}>{user.status}</span></td><td>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never"}</td><td><select className="admin-input" value={user.role_id} onChange={async (e) => { try { await staffApi.update(user.id, { role_id: e.target.value }); await load(); flash("Staff role updated.") } catch (err) { setError(errorText(err)) } }}>{roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}</select></td><td><button onClick={async () => { try { await staffApi.update(user.id, { status: user.status === "active" ? "inactive" : "active" }); await load(); flash(`Staff account ${user.status === "active" ? "deactivated" : "activated"}.`) } catch (err) { setError(errorText(err)) } }} className="admin-outline !py-2">{user.status === "active" ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table></div></div>}
    {(tab === "roles" || tab === "permissions") && <div className="grid lg:grid-cols-2 gap-4 mt-5">{roles.map((role) => <article className="bg-white border rounded-2xl p-5" key={role.id}><div className="flex justify-between gap-3"><div><h2 className="font-serif text-xl font-bold">{role.name}</h2><p className="text-sm text-[#777] mt-1">{role.description}</p></div><button className="admin-outline !py-2" onClick={() => setRoleModal(role)}>Edit</button></div><p className="mt-4 text-sm"><b>{role.assigned_user_count}</b> assigned users · <b>{role.permissions.length}</b> permissions</p>{tab === "permissions" && <div className="mt-3 flex flex-wrap gap-1">{role.permissions.map((permission) => <span className="pill neutral" key={permission}>{permissionLabel(permission)}</span>)}</div>}</article>)}</div>}
    {staffModal && <StaffModal />}{roleModal && <RoleModal value={roleModal} />}
  </AdminShell>
}
