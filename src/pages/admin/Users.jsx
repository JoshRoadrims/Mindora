import { Users as UsersIcon } from 'lucide-react'
import Placeholder from '../../components/Placeholder.jsx'

export default function Users() {
  return (
    <Placeholder
      eyebrow="Users"
      title="User management"
      icon={UsersIcon}
      description="Search, segment, and manage individual user accounts on the platform."
    />
  )
}
