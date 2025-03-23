import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'

const DashboardPage = async () => {
  //Authentication
  const auth = await onAuthenticateUser()
  if (auth.status === 200 || auth.status === 201) {
    if (auth.user?.subscription?.plan == "NONE") return redirect(`/dashboard/${auth.user?.workspace[0].id}/billing`)
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  }
  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    return redirect('/auth/sign-in')
  }
}

export default DashboardPage
