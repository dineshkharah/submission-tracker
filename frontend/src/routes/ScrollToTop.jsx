import { useEffect } from 'react'
import { useLocation } from 'react-router'

/*
  A browser keeps the scroll position when the page does not really change, and to the browser a route change is not a new page. So opening a course from halfway down a dashboard would drop somebody into the middle of the assignment list with the course title already above them.

  Renders nothing. It exists only for the effect, which is why it sits beside the route guards rather than among the components.
*/
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
