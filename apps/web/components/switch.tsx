/** Shared toggle switch (used in user settings + admin system settings). */
export default function Switch({ defaultChecked, name }: { defaultChecked?: boolean; name?: string }) {
  return (
    <label className="switch">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span className="track" />
    </label>
  )
}
