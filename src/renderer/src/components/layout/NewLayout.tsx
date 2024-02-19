import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

function NewLayout({ }: Props) {
  return (
    <div><ul>
      <li>
        <Link to={'/'}>
          Home
        </Link>
        <Link to={'/stats'}>
          stats
        </Link>
        <Link to={'/settings'}>
          settings
        </Link>
      </li>
    </ul>
    </div>
  )
}

export default NewLayout