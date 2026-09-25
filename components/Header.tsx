"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopNav = [
  ["/bible", "BIBLE"],
  ["/stories", "STORIES"],
  ["/people", "PEOPLE"],
  ["/places", "PLACES"],
  ["/timeline", "TIMELINE"],
  ["/visual", "VISUAL"],
  ["/search", "SEARCH"],
] as const;

const mobileNav = [
  ["/", "HOME", "⌂"],
  ["/stories", "STORIES", "▣"],
  ["/people", "PEOPLE", "♙"],
  ["/places", "PLACES", "⌖"],
  ["/search", "SEARCH", "⌕"],
] as const;

function isActive(
  pathname: string,
  href: string
) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}

export default function Header() {
  const pathname =
    usePathname();

  return (
    <>
      <header className="topbar">

        <Link
          href="/"
          className="brand"
          aria-label="SCRAPTURA Home"
        >
          <span className="brandText">
            <b>SCRAPTURA</b>

            <small>
              EXPLORE THE WORLD OF SCRIPTURE
            </small>
          </span>
        </Link>


        <nav
          aria-label="Primary navigation"
        >
          {desktopNav.map(
            ([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  isActive(
                    pathname,
                    href
                  )
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            )
          )}
        </nav>


        <Link
          className="journeyBtn"
          href="/journeys"
        >
          BEGIN A JOURNEY
        </Link>

      </header>


      <nav
        className="mobileNav"
        aria-label="Mobile navigation"
      >
        {mobileNav.map(
          (
            [
              href,
              label,
              icon,
            ]
          ) => {

            const active =
              isActive(
                pathname,
                href
              );

            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "active"
                    : undefined
                }
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
              >
                <span
                  className="mobileNavIcon"
                  aria-hidden="true"
                >
                  {icon}
                </span>

                <span className="mobileNavLabel">
                  {label}
                </span>
              </Link>
            );
          }
        )}
      </nav>
    </>
  );
}