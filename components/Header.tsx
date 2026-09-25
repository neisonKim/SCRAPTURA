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
  ["/", "HOME", "home"],
  ["/stories", "STORIES", "stories"],
  ["/people", "PEOPLE", "people"],
  ["/places", "PLACES", "places"],
  ["/search", "SEARCH", "search"],
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

function MobileIcon({
  type,
}: {
  type: string;
}) {
  if (type === "home") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v9h13v-9" />
        <path d="M9.5 19v-5h5v5" />
      </svg>
    );
  }

  if (type === "stories") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 4.5h11a3 3 0 0 1 3 3V19H8a3 3 0 0 1-3-3Z" />
        <path d="M8 4.5v14.5" />
        <path d="M11 8h5" />
        <path d="M11 11h5" />
      </svg>
    );
  }

  if (type === "people") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 19c.8-4 2.7-6 5.5-6s4.7 2 5.5 6" />
      </svg>
    );
  }

  if (type === "places") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 21s6-6.1 6-11a6 6 0 1 0-12 0c0 4.9 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24">
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className="topbar">
        <Link
          href="/"
          className="brand"
          aria-label="SCRAPTURA Home"
        >
          <span
            className="cross"
            aria-hidden="true"
          >
            ✝
          </span>

          <span>
            <b>SCRAPTURA</b>
            <small>
              EXPLORE THE WORLD OF SCRIPTURE
            </small>
          </span>
        </Link>

        <nav aria-label="Primary navigation">
          {desktopNav.map(
            ([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  isActive(
                    pathname,
                    href,
                  )
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ),
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
          ([href, label, icon]) => {
            const active =
              isActive(
                pathname,
                href,
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
                  <MobileIcon
                    type={icon}
                  />
                </span>

                <span className="mobileNavLabel">
                  {label}
                </span>
              </Link>
            );
          },
        )}
      </nav>
    </>
  );
}