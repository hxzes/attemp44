import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>WisePicks API</title>
        <meta name="description" content="WisePicks API Server" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "2rem" }}>WisePicks API</h1>
        <div style={{ maxWidth: "800px" }}>
          <h2>Available Endpoints:</h2>
          <ul style={{ lineHeight: "1.8" }}>
            <li>
              <strong>POST /api/auth/register</strong> - Register a new user
            </li>
            <li>
              <strong>POST /api/auth/login</strong> - Login with Supabase Auth
            </li>
            <li>
              <strong>GET /api/auth/me</strong> - Get current user profile
            </li>
            <li>
              <strong>POST /api/auth/logout</strong> - Logout from Supabase Auth
            </li>
            <li>
              <strong>PUT /api/auth/update-profile</strong> - Update user profile
            </li>
            <li>
              <strong>GET /api/admin/users</strong> - (Admin only) Get all users
            </li>
            <li>
              <strong>PUT /api/admin/update-user</strong> - (Admin only) Update user details
            </li>
            <li>
              <strong>POST /api/admin/reset-password</strong> - (Admin only) Reset user password
            </li>
          </ul>

          <p style={{ marginTop: "2rem" }}>
            This is the API server for WisePicks. For more information, check the documentation.
          </p>
        </div>
      </main>
    </>
  )
}

