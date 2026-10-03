import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'

// ------------------------------------------------
// API
// ------------------------------------------------

const ACCOUNTS_API =
  'https://walid.tail98a0b9.ts.net/webhook/dashboard-accounts'

const CONVERSATIONS_API =
  'https://walid.tail98a0b9.ts.net/webhook/dashboard-conversations'

// ------------------------------------------------
// AUTH SCREEN
// ------------------------------------------------

function AuthScreen() {
  const [mode, setMode] = useState('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')
    setErrorMessage('')

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      setErrorMessage(error.message)
    }

    setLoading(false)
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')
    setErrorMessage('')

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            full_name: fullName,
            workspace_name:
              workspaceName.trim() || 'My Workspace',
          },
        },
      })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setMessage(
        'Account created. Check your email to confirm your account, then log in.'
      )
    } else {
      setMessage('Account created successfully.')
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f6f7fb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '22px',
          padding: '40px',
          border: '1px solid #e7e9f1',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '55px',
              height: '55px',
              borderRadius: '15px',
              background: '#6366f1',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '21px',
            }}
          >
            AI
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: '#111827',
              }}
            >
              Social Listening
            </h2>

            <span
              style={{
                color: '#7b8499',
              }}
            >
              AI Dashboard
            </span>
          </div>
        </div>

        <h1
          style={{
            marginBottom: '8px',
            color: '#111827',
          }}
        >
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </h1>

        <p
          style={{
            color: '#7b8499',
            marginTop: 0,
            marginBottom: '28px',
          }}
        >
          {mode === 'login'
            ? 'Log in to access your social listening workspace.'
            : 'Create your workspace and connect your social accounts.'}
        </p>

        <form
          onSubmit={
            mode === 'login'
              ? handleLogin
              : handleSignup
          }
        >
          {mode === 'signup' && (
            <>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: '600',
                }}
              >
                Your name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Your name"
                style={inputStyle}
              />

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontWeight: '600',
                }}
              >
                Workspace name
              </label>

              <input
                type="text"
                value={workspaceName}
                onChange={(event) =>
                  setWorkspaceName(event.target.value)
                }
                placeholder="Example: Cocco Baby"
                style={inputStyle}
              />
            </>
          )}

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              fontWeight: '600',
            }}
          >
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            style={inputStyle}
          />

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              fontWeight: '600',
            }}
          >
            Password
          </label>

          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Your password"
            style={inputStyle}
          />

          {errorMessage && (
            <div
              style={{
                background: '#fff0f0',
                color: '#c53030',
                padding: '12px 15px',
                borderRadius: '10px',
                marginBottom: '18px',
              }}
            >
              {errorMessage}
            </div>
          )}

          {message && (
            <div
              style={{
                background: '#eefbf3',
                color: '#27804a',
                padding: '12px 15px',
                borderRadius: '10px',
                marginBottom: '18px',
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '11px',
              background: '#6366f1',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Log in'
              : 'Create account'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            color: '#7b8499',
          }}
        >
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}

          <button
            type="button"
            onClick={() => {
              setMode(
                mode === 'login'
                  ? 'signup'
                  : 'login'
              )

              setErrorMessage('')
              setMessage('')
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#6366f1',
              cursor: 'pointer',
              fontWeight: '700',
              marginLeft: '6px',
            }}
          >
            {mode === 'login'
              ? 'Sign up'
              : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 14px',
  marginBottom: '20px',
  borderRadius: '10px',
  border: '1px solid #dfe2eb',
  fontSize: '15px',
  outline: 'none',
}

// ------------------------------------------------
// MAIN APP
// ------------------------------------------------

function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] =
    useState(true)

  const [workspace, setWorkspace] =
    useState(null)

  const [workspaceLoading, setWorkspaceLoading] =
    useState(false)

  const [workspaceError, setWorkspaceError] =
    useState('')

  const [page, setPage] = useState('overview')

  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] =
    useState(false)
  const [accountsError, setAccountsError] =
    useState(false)

  const [conversations, setConversations] =
    useState([])

  const [
    conversationsLoading,
    setConversationsLoading,
  ] = useState(false)

  const [
    conversationsError,
    setConversationsError,
  ] = useState(false)

  // ------------------------------------------------
  // LOAD WORKSPACE
  // ------------------------------------------------

  const loadWorkspace = async (userId) => {
    if (!userId) return

    setWorkspaceLoading(true)
    setWorkspaceError('')

    try {
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('workspace_id')
        .eq('id', userId)
        .single()

      if (profileError) {
        throw profileError
      }

      const {
        data: workspaceData,
        error: workspaceResultError,
      } = await supabase
        .from('workspaces')
        .select(
          'id, workspace_code, name, owner_user_id'
        )
        .eq('id', profile.workspace_id)
        .single()

      if (workspaceResultError) {
        throw workspaceResultError
      }

      setWorkspace(workspaceData)

      const newUrl = new URL(
        window.location.href
      )

      newUrl.searchParams.set(
        'workspace_id',
        workspaceData.workspace_code.trim()
      )

      window.history.replaceState(
        {},
        '',
        newUrl.toString()
      )
    } catch (error) {
      console.error(
        'Workspace error:',
        error
      )

      setWorkspaceError(
        'Unable to load your workspace.'
      )
    } finally {
      setWorkspaceLoading(false)
    }
  }

  // ------------------------------------------------
  // AUTH SESSION
  // ------------------------------------------------

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      const {
        data: { session: currentSession },
        error,
      } =
        await supabase.auth.getSession()

      if (error) {
        console.error(
          'Session error:',
          error
        )
      }

      if (!mounted) return

      setSession(currentSession)

      if (currentSession?.user?.id) {
        await loadWorkspace(
          currentSession.user.id
        )
      }

      setAuthLoading(false)
    }

    initializeAuth()

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return

          setSession(newSession)

          if (newSession?.user?.id) {
            await loadWorkspace(
              newSession.user.id
            )
          } else {
            setWorkspace(null)
            setAccounts([])
            setConversations([])
          }

          setAuthLoading(false)
        }
      )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ------------------------------------------------
  // CURRENT WORKSPACE
  // ------------------------------------------------

  const WORKSPACE_ID =
    workspace?.workspace_code?.trim() || null

  // ------------------------------------------------
  // GET ACCESS TOKEN
  // ------------------------------------------------

  const getAccessToken = async () => {
    const {
      data: { session: currentSession },
      error,
    } =
      await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!currentSession?.access_token) {
      throw new Error(
        'No authenticated Supabase session.'
      )
    }

    return currentSession.access_token
  }

  // ------------------------------------------------
  // SECURE META CONNECTION
  // ------------------------------------------------

  const connectMeta = async () => {
    if (
      !WORKSPACE_ID ||
      !workspace?.id ||
      !session?.user?.id
    ) {
      alert(
        'Workspace is not ready yet. Please refresh and try again.'
      )
      return
    }

    try {
      const stateToken =
        crypto.randomUUID()

      const { error } = await supabase
        .from('meta_oauth_states')
        .insert({
          state_token: stateToken,
          user_id: session.user.id,
          workspace_id: workspace.id,
          workspace_code: WORKSPACE_ID,
        })

      if (error) {
        throw error
      }

      const redirectUri =
        'https://walid.tail98a0b9.ts.net/webhook/meta-oauth-callback'

      const authUrl =
        'https://www.facebook.com/v26.0/dialog/oauth' +
        '?client_id=1092780679954456' +
        '&redirect_uri=' +
        encodeURIComponent(redirectUri) +
        '&config_id=1092906659894071' +
        '&response_type=code' +
        '&override_default_response_type=true' +
        '&state=' +
        encodeURIComponent(stateToken)

      window.location.href = authUrl
    } catch (error) {
      console.error(
        'Meta connection error:',
        error
      )

      alert(
        'Unable to start Meta connection. Please try again.'
      )
    }
  }

  // ------------------------------------------------
  // LOAD ACCOUNTS
  // ------------------------------------------------

  const loadAccounts = async () => {
    if (!WORKSPACE_ID) {
      return
    }

    setAccountsLoading(true)
    setAccountsError(false)

    try {
      const accessToken =
        await getAccessToken()

      const response = await fetch(
        `${ACCOUNTS_API}?workspace_id=${encodeURIComponent(
          WORKSPACE_ID
        )}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorText =
          await response.text()

        console.error(
          'Accounts API error:',
          response.status,
          errorText
        )

        throw new Error(
          `Unable to load accounts: ${response.status}`
        )
      }

      const data = await response.json()

      const formatted = data.map(
        (account) => ({
          id: account.id,

          name:
            account.account_name ||
            'Social Account',

          accountId: String(
            account.account_id || ''
          ).trim(),

          platform:
            account.platform,

          type:
            account.platform ===
            'facebook'
              ? 'Facebook Page'
              : 'Instagram Business',

          icon:
            account.platform ===
            'facebook'
              ? 'f'
              : '◎',

          className:
            account.platform ===
            'facebook'
              ? 'facebook'
              : 'instagram',

          status:
            account.status,
        })
      )

      setAccounts(formatted)
    } catch (error) {
      console.error(
        'Accounts error:',
        error
      )

      setAccountsError(true)
    } finally {
      setAccountsLoading(false)
    }
  }

  // ------------------------------------------------
  // LOAD CONVERSATIONS
  // ------------------------------------------------

  const loadConversations = async () => {
    if (!WORKSPACE_ID) {
      return
    }

    setConversationsLoading(true)
    setConversationsError(false)

    try {
      const accessToken =
        await getAccessToken()

      const response = await fetch(
        `${CONVERSATIONS_API}?workspace_id=${encodeURIComponent(
          WORKSPACE_ID
        )}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorText =
          await response.text()

        console.error(
          'Conversations API error:',
          response.status,
          errorText
        )

        throw new Error(
          `Unable to load conversations: ${response.status}`
        )
      }

      const data = await response.json()

      const cleanData = data
        .filter(
          (item) =>
            item.comment_text &&
            String(
              item.comment_text
            ).trim() !== ''
        )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )

      setConversations(cleanData)
    } catch (error) {
      console.error(
        'Conversations error:',
        error
      )

      setConversationsError(true)
    } finally {
      setConversationsLoading(false)
    }
  }

  // ------------------------------------------------
  // LOAD DASHBOARD DATA
  // ------------------------------------------------

  useEffect(() => {
    if (!WORKSPACE_ID) return

    loadAccounts()
    loadConversations()
  }, [WORKSPACE_ID])

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  const logout = async () => {
    await supabase.auth.signOut()

    setSession(null)
    setWorkspace(null)
    setAccounts([])
    setConversations([])

    const cleanUrl = new URL(
      window.location.href
    )

    cleanUrl.searchParams.delete(
      'workspace_id'
    )

    window.history.replaceState(
      {},
      '',
      cleanUrl.toString()
    )
  }

  // ------------------------------------------------
  // STATS
  // ------------------------------------------------

  const needsReplyCount = useMemo(
    () =>
      conversations.filter(
        (conversation) =>
          conversation.needs_reply ===
          true
      ).length,
    [conversations]
  )

  const positiveCount = useMemo(
    () =>
      conversations.filter(
        (conversation) =>
          String(
            conversation.sentiment || ''
          ).toLowerCase() ===
          'positive'
      ).length,
    [conversations]
  )

  const positivePercent =
    conversations.length > 0
      ? Math.round(
          (positiveCount /
            conversations.length) *
            100
        )
      : 0

  // ------------------------------------------------
  // HELPERS
  // ------------------------------------------------

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(
      date
    ).toLocaleString()
  }

  const sentimentClass = (
    sentiment
  ) => {
    const value = String(
      sentiment || ''
    ).toLowerCase()

    if (value === 'positive')
      return 'positive'

    if (value === 'negative')
      return 'reply'

    return 'neutral'
  }

  // ------------------------------------------------
  // ACCOUNT ROW
  // ------------------------------------------------

  const AccountRow = ({
    account,
  }) => (
    <div className="social-account-row">

      <div
        className={`account-icon ${account.className}`}
      >
        {account.icon}
      </div>

      <div className="social-account-details">
        <strong>
          {account.name}
        </strong>

        <span>
          {account.type}
        </span>
      </div>

      <div className="monitoring">
        <span className="monitor-dot"></span>

        Monitoring
      </div>

      <span className="status">
        {account.status === 'active'
          ? 'Connected'
          : account.status}
      </span>

    </div>
  )

  // ------------------------------------------------
  // CONVERSATION CARD
  // ------------------------------------------------

  const ConversationCard = ({
    conversation,
    detailed = false,
  }) => {
    const isFacebook =
      conversation.platform ===
      'facebook'

    return (
      <div
        className={
          detailed
            ? 'conversation-full'
            : 'conversation'
        }
      >

        <div
          className={`platform ${
            isFacebook
              ? 'facebook'
              : 'instagram'
          }`}
        >
          {isFacebook
            ? 'f'
            : '◎'}
        </div>

        <div className="conversation-main">

          <div className="conversation-header">
            <div>
              <strong>
                {conversation.account_name ||
                  'Social Account'}
              </strong>

              <span>
                {isFacebook
                  ? 'Facebook'
                  : 'Instagram'}

                {conversation.author_name
                  ? ` · ${conversation.author_name}`
                  : ''}
              </span>
            </div>

            <span className="time">
              {formatDate(
                conversation.createdAt
              )}
            </span>
          </div>

          <p className="comment">
            “{conversation.comment_text}”
          </p>

          <div className="tags">

            <span
              className={`tag ${sentimentClass(
                conversation.sentiment
              )}`}
            >
              {conversation.sentiment ||
                'Unknown'}
            </span>

            {conversation.intent && (
              <span className="tag">
                {conversation.intent}
              </span>
            )}

            {conversation.is_question && (
              <span className="tag">
                Question
              </span>
            )}

            {conversation.is_complaint && (
              <span className="tag reply">
                Complaint
              </span>
            )}

            {conversation.needs_reply && (
              <span className="tag reply">
                Needs reply
              </span>
            )}

            {conversation.needs_human && (
              <span className="tag reply">
                Needs human
              </span>
            )}

          </div>

          {detailed && (
            <div className="conversation-ai">

              <div className="ai-analysis-block">
                <span className="analysis-label">
                  AI SUMMARY
                </span>

                <p>
                  {conversation.summary ||
                    'No AI summary available.'}
                </p>
              </div>

              <div className="ai-analysis-block">
                <span className="analysis-label">
                  SUGGESTED REPLY
                </span>

                <p>
                  {conversation.suggested_reply ||
                    'No suggested reply available.'}
                </p>
              </div>

              <div className="conversation-meta">

                <span>
                  Language:{' '}
                  <strong>
                    {conversation.language ||
                      'Unknown'}
                  </strong>
                </span>

                <span>
                  Urgency:{' '}
                  <strong>
                    {conversation.urgency ||
                      'Unknown'}
                  </strong>
                </span>

              </div>

            </div>
          )}

        </div>

      </div>
    )
  }

  // ------------------------------------------------
  // AUTH LOADING
  // ------------------------------------------------

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Loading...
      </div>
    )
  }

  // ------------------------------------------------
  // LOGIN
  // ------------------------------------------------

  if (!session) {
    return <AuthScreen />
  }

  // ------------------------------------------------
  // WORKSPACE LOADING
  // ------------------------------------------------

  if (workspaceLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Loading workspace...
      </div>
    )
  }

  if (workspaceError) {
    return (
      <div
        style={{
          padding: '40px',
        }}
      >
        <h2>
          Workspace error
        </h2>

        <p>{workspaceError}</p>

        <button
          onClick={logout}
        >
          Log out
        </button>
      </div>
    )
  }

  // ------------------------------------------------
  // DASHBOARD
  // ------------------------------------------------

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            AI
          </div>

          <div>
            <h2>
              Social Listening
            </h2>

            <span>
              AI Dashboard
            </span>
          </div>

        </div>

        <nav className="nav">

          <button
            className={`nav-item ${
              page === 'overview'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPage('overview')
            }
          >
            <span>◫</span>
            Overview
          </button>

          <button
            className={`nav-item ${
              page === 'conversations'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPage(
                'conversations'
              )
            }
          >
            <span>◉</span>
            Conversations
          </button>

          <button
            className={`nav-item ${
              page === 'accounts'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPage('accounts')
            }
          >
            <span>◎</span>
            Social Accounts
          </button>

          {/* NEW KNOWLEDGE BASE */}

          <button
            className={`nav-item ${
              page === 'knowledge'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPage('knowledge')
            }
          >
            <span>▦</span>
            Knowledge Base
          </button>

          <button
            className={`nav-item ${
              page === 'settings'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPage('settings')
            }
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="workspace">

            <div className="workspace-avatar">
              {workspace?.name
                ?.charAt(0)
                .toUpperCase() ||
                'W'}
            </div>

            <div>
              <strong>
                {workspace?.name ||
                  WORKSPACE_ID}
              </strong>

              <span>
                {WORKSPACE_ID}
              </span>
            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* OVERVIEW */}

        {page === 'overview' && (
          <>
            <header className="topbar">

              <div>
                <h1>
                  Overview
                </h1>

                <p>
                  Monitor and understand
                  conversations across your
                  social accounts.
                </p>
              </div>

              <button
                className="connect-btn"
                onClick={() =>
                  setPage('accounts')
                }
              >
                + Connect Facebook &
                Instagram
              </button>

            </header>

            <section className="stats">

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Connected Accounts
                  </span>

                  <div className="stat-icon">
                    ◎
                  </div>

                </div>

                <strong>
                  {accountsLoading
                    ? '...'
                    : accounts.length}
                </strong>

                <p>
                  Facebook & Instagram
                </p>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Conversations
                  </span>

                  <div className="stat-icon">
                    ◉
                  </div>

                </div>

                <strong>
                  {conversationsLoading
                    ? '...'
                    : conversations.length}
                </strong>

                <p>
                  Comments analyzed
                </p>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Need Reply
                  </span>

                  <div className="stat-icon">
                    ↩
                  </div>

                </div>

                <strong>
                  {conversationsLoading
                    ? '...'
                    : needsReplyCount}
                </strong>

                <p>
                  Require your attention
                </p>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Positive Sentiment
                  </span>

                  <div className="stat-icon">
                    ☺
                  </div>

                </div>

                <strong>
                  {conversationsLoading
                    ? '...'
                    : `${positivePercent}%`}
                </strong>

                <p>
                  Across conversations
                </p>

              </div>

            </section>

            <div className="content-grid">

              {/* RECENT CONVERSATIONS */}

              <section className="panel conversations-panel">

                <div className="panel-header">

                  <div>

                    <h3>
                      Recent Conversations
                    </h3>

                    <p>
                      Latest comments detected
                      by your social listening
                      engine.
                    </p>

                  </div>

                  <button
                    className="link-btn"
                    onClick={() =>
                      setPage(
                        'conversations'
                      )
                    }
                  >
                    View all
                  </button>

                </div>

                {conversationsLoading && (
                  <p>
                    Loading conversations...
                  </p>
                )}

                {conversationsError && (
                  <p>
                    Unable to load
                    conversations.
                  </p>
                )}

                {!conversationsLoading &&
                  conversations.length ===
                    0 && (
                    <p>
                      No conversations yet.
                    </p>
                  )}

                {!conversationsLoading &&
                  conversations
                    .slice(0, 3)
                    .map(
                      (
                        conversation
                      ) => (
                        <ConversationCard
                          key={
                            conversation.id
                          }
                          conversation={
                            conversation
                          }
                        />
                      )
                    )}

              </section>

              {/* CONNECTED ACCOUNTS */}

              <section className="panel accounts-panel">

                <div className="panel-header">

                  <div>

                    <h3>
                      Connected Accounts
                    </h3>

                    <p>
                      Accounts currently
                      monitored.
                    </p>

                  </div>

                </div>

                {accountsLoading && (
                  <p>
                    Loading connected
                    accounts...
                  </p>
                )}

                {accountsError && (
                  <p>
                    Unable to load accounts.
                  </p>
                )}

                {!accountsLoading &&
                  accounts.length ===
                    0 && (
                    <p>
                      No accounts connected
                      yet.
                    </p>
                  )}

                {!accountsLoading &&
                  accounts
                    .slice(0, 4)
                    .map(
                      (account) => (
                        <div
                          className="account"
                          key={account.id}
                        >

                          <div
                            className={`account-icon ${account.className}`}
                          >
                            {account.icon}
                          </div>

                          <div className="account-info">

                            <strong>
                              {account.name}
                            </strong>

                            <span>
                              {account.type}
                            </span>

                          </div>

                          <span className="status">
                            Connected
                          </span>

                        </div>
                      )
                    )}

                <button
                  className="secondary-btn"
                  onClick={() =>
                    setPage('accounts')
                  }
                >
                  Manage social accounts
                </button>

              </section>

            </div>
          </>
        )}

        {/* CONVERSATIONS */}

        {page === 'conversations' && (
          <>
            <header className="topbar">

              <div>

                <h1>
                  Conversations
                </h1>

                <p>
                  View comments detected and
                  analyzed by your AI Social
                  Listening Engine.
                </p>

              </div>

              <button
                className="secondary-btn refresh-btn"
                onClick={
                  loadConversations
                }
              >
                Refresh
              </button>

            </header>

            <section className="panel conversations-page">

              <div className="panel-header">

                <div>

                  <h3>
                    Social Conversations
                  </h3>

                  <p>
                    {conversations.length}{' '}
                    conversations detected for
                    this workspace.
                  </p>

                </div>

              </div>

              {conversationsLoading && (
                <p>
                  Loading conversations...
                </p>
              )}

              {conversationsError && (
                <p>
                  Unable to load
                  conversations.
                </p>
              )}

              {!conversationsLoading &&
                conversations.length ===
                  0 && (
                  <div className="empty-state">

                    <h3>
                      No conversations yet
                    </h3>

                    <p>
                      New Facebook and
                      Instagram comments will
                      appear here
                      automatically.
                    </p>

                  </div>
                )}

              {!conversationsLoading &&
                conversations.map(
                  (
                    conversation
                  ) => (
                    <ConversationCard
                      key={
                        conversation.id
                      }
                      conversation={
                        conversation
                      }
                      detailed
                    />
                  )
                )}

            </section>
          </>
        )}

        {/* SOCIAL ACCOUNTS */}

        {page === 'accounts' && (
          <>
            <header className="topbar">

              <div>

                <h1>
                  Social Accounts
                </h1>

                <p>
                  Connect and manage the
                  Facebook and Instagram
                  accounts you want to
                  monitor.
                </p>

              </div>

              <button
                className="connect-btn"
                onClick={connectMeta}
              >
                + Connect Facebook &
                Instagram
              </button>

            </header>

            <section className="accounts-connect-card">

              <div className="connect-logo">
                ◎
              </div>

              <div className="connect-copy">

                <h2>
                  Connect your Meta
                  accounts
                </h2>

                <p>
                  Connect Facebook once and
                  choose the Pages and
                  Instagram accounts your
                  business wants to monitor.
                </p>

              </div>

              <button
                className="connect-btn"
                onClick={connectMeta}
              >
                Connect Meta Account
              </button>

            </section>

            <section className="panel social-account-list">

              <div className="panel-header">

                <div>

                  <h3>
                    Connected accounts
                  </h3>

                  <p>
                    These accounts are
                    currently connected to
                    this workspace.
                  </p>

                </div>

                <span className="accounts-count">
                  {accounts.length}{' '}
                  {accounts.length === 1
                    ? 'account'
                    : 'accounts'}
                </span>

              </div>

              {accountsLoading && (
                <p>
                  Loading connected
                  accounts...
                </p>
              )}

              {accountsError && (
                <p>
                  Unable to load connected
                  accounts.
                </p>
              )}

              {!accountsLoading &&
                accounts.length ===
                  0 && (
                  <div className="empty-state">

                    <h3>
                      No social accounts
                      connected
                    </h3>

                    <p>
                      Connect your Facebook
                      and Instagram accounts
                      to start monitoring.
                    </p>

                  </div>
                )}

              {!accountsLoading &&
                accounts.map(
                  (account) => (
                    <AccountRow
                      key={account.id}
                      account={account}
                    />
                  )
                )}

            </section>
          </>
        )}

        {/* KNOWLEDGE BASE */}

        {page === 'knowledge' && (
          <>
            <header className="topbar">

              <div>

                <h1>
                  Knowledge Base
                </h1>

                <p>
                  Manage the information your
                  AI uses to understand your
                  brand and products.
                </p>

              </div>

            </header>

            <section className="panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Products
                  </h3>

                  <p>
                    Upload your product catalog
                    so the AI can understand
                    your products before
                    replying to customers.
                  </p>

                </div>

                <button className="connect-btn">
                  + Upload Product File
                </button>

              </div>

              <div className="empty-state">

                <h3>
                  No products imported yet
                </h3>

                <p>
                  Upload a CSV or Excel product
                  catalog to create your AI
                  product knowledge base.
                </p>

              </div>

            </section>
          </>
        )}

        {/* SETTINGS */}

        {page === 'settings' && (
          <>
            <header className="topbar">

              <div>

                <h1>
                  Settings
                </h1>

                <p>
                  Manage your workspace and
                  account.
                </p>

              </div>

            </header>

            <section className="panel">

              <h3>
                Workspace
              </h3>

              <p>
                <strong>
                  Workspace:
                </strong>{' '}
                {workspace?.name}
              </p>

              <p>
                <strong>
                  Workspace Code:
                </strong>{' '}
                {WORKSPACE_ID}
              </p>

              <p>
                <strong>
                  User:
                </strong>{' '}
                {session?.user?.email}
              </p>

              <button
                className="secondary-btn"
                onClick={logout}
              >
                Log out
              </button>

            </section>
          </>
        )}

      </main>

    </div>
  )
}

export default App