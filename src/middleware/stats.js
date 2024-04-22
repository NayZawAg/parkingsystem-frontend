export default function ({ store, redirect }) {
  // If the general user
  if (store.state.auth.user.user_type == 0) {
    return redirect('/')
  }
}