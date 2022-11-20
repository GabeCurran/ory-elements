import { ThemeProvider } from "@ory/elements"
import React from "react"
import Link from "next/link"

// React
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Ory SDK
import { ory } from "../components/sdk"

// import css
import styles from "../styles/Dashboard.module.css"
import "@ory/elements/style.css"

import { AxiosError } from "axios"
import type { NextPage } from "next"
import { createLogoutHandler } from "../pkg/hooks"

const Home: NextPage = () => {
  const [session, setSession] = useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one.",
  )
  const [hasSession, setHasSession] = useState<boolean>(false)
  const router = useRouter()
  const onLogout = createLogoutHandler()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(session)
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // it's second factor
            return router.push("/login?aal=aal2")
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, [])

  return (
    <div className={styles.container}>
      <title>Next.js w/ Elements</title>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://nextjs.org" target="_blank" rel="noreferrer">
            Next.js
          </a>{" "}
          with{" "}
          <a
            href="https://github.com/ory/elements"
            target="_blank"
            rel="noreferrer"
          >
            Ory Elements
          </a>
        </h1>
        <p>
          <Link href="/login"><a>Sign In</a></Link>
        </p>
        <p>
          <Link href='/' onClick={onLogout}><a>Logout</a></Link>
        </p>

        {/* <p className={styles.description}>
          <a href={"/login"}>Login</a>
        </p> */}

        <React.StrictMode>
          {/* We add the Ory themes here */}
          <ThemeProvider themeOverrides={{}}>
            <Link href="/login"></Link>
            {/* <Link href="/signup"><Registration /></Link> */}
            {/* <Link href="/verification"><Verification /></Link>
            <Link href="/recovery"><Recovery /></Link>
            <Link href="/settings"><Settings /></Link> */}
          </ThemeProvider>
        </React.StrictMode>
      </main>
    </div>
  )
}

export default Home
