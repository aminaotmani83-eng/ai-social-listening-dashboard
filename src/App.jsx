import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const params = new URLSearchParams(window.location.search)

  const WORKSPACE_ID =
    params.get('workspace_id') || 'DEMO_WORKSPACE_001'

  const ACCOUNTS_API =
    'https://walid.tail98a0b9.ts.net/webhook/dashboard-accounts'

  const CONVERSATIONS_API =
    'https://walid.tail98a0b9.ts.net/webhook/dashboard-conversations'

  const [page, setPage] = useState('overview')

  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState(false)

  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [conversationsError, setConversationsError] = useState(false)

  // ----------------------------------
  // META CONNECTION
  // ----------------------------------

  const connectMeta = () => {
    const authUrl =
      'https://www.facebook.com/v26.0/dialog/oauth' +
      '?client_id=1092780679954456' +
      '&redirect_uri=' +
      encodeURIComponent(
        'https://walid.tail98a0b9.ts.net/webhook/meta-oauth-callback'
      ) +
      '&config_id=1092906659894071' +
      '&response_type=code' +
      '&override_default_response_type=true' +
      '&state=' +
      encodeURIComponent(WORKSPACE_ID)

    window.location.href = authUrl
  }

  // ----------------------------------
  // LOAD ACCOUNTS
  // ----------------------------------

  const loadAccounts = async () => {
    setAccountsLoading(true)
    setAccountsError(false)

    try {
      const response = await fetch(
        `${ACCOUNTS_API}?workspace_id=${encodeURIComponent(WORKSPACE_ID)}`
      )

      if (!response.ok) {
        throw new Error('Unable to load accounts')
      }

      const data = await response.json()

      const formatted = data.map((account) => ({
        id: account.id,
        name: account.account_name,
        accountId: String(account.account_id || '').trim(),
        platform: account.platform,
        type:
          account.platform === 'facebook'
            ? 'Facebook Page'
            : 'Instagram Business',
        icon: account.platform === 'facebook' ? 'f' : '◎',
        className:
          account.platform === 'facebook'
            ? 'facebook'
            : 'instagram',
        status: account.status,
      }))

      setAccounts(formatted)
    } catch (error) {
      console.error(error)
      setAccountsError(true)
    } finally {
      setAccountsLoading(false)
    }
  }

  // ----------------------------------
  // LOAD CONVERSATIONS
  // ----------------------------------

  const loadConversations = async () => {
    setConversationsLoading(true)
    setConversationsError(false)

    try {
      const response = await fetch(
        `${CONVERSATIONS_API}?workspace_id=${encodeURIComponent(
          WORKSPACE_ID
        )}`
      )

      if (!response.ok) {
        throw new Error('Unable to load conversations')
      }

      const data = await response.json()

      const cleanData = data
        .filter(
          (item) =>
            item.comment_text &&
            String(item.comment_text).trim() !== ''
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )

      setConversations(cleanData)
    } catch (error) {
      console.error(error)
      setConversationsError(true)
    } finally {
      setConversationsLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
    loadConversations()
  }, [WORKSPACE_ID])

  // ----------------------------------
  // DASHBOARD STATS
  // ----------------------------------

  const needsReplyCount = useMemo(() => {
    return conversations.filter(
      (conversation) => conversation.needs_reply === true
    ).length
  }, [conversations])

  const positiveCount = useMemo(() => {
    return conversations.filter(
      (conversation) =>
        String(conversation.sentiment || '').toLowerCase() === 'positive'
    ).length
  }, [conversations])

  const positivePercent =
    conversations.length > 0
      ? Math.round((positiveCount / conversations.length) * 100)
      : 0

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleString()
  }

  const sentimentClass = (sentiment) => {
    const value = String(sentiment || '').toLowerCase()

    if (value === 'positive') return 'positive'
    if (value === 'negative') return 'reply'

    return 'neutral'
  }

  // ----------------------------------
  // ACCOUNT COMPONENT
  // ----------------------------------

  const AccountRow = ({ account }) => (
    <div className="social-account-row">
      <div className={`account-icon ${account.className}`}>
        {account.icon}
      </div>

      <div className="social-account-details">
        <strong>{account.name}</strong>
        <span>{account.type}</span>
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

  // ----------------------------------
  // CONVERSATION COMPONENT
  // ----------------------------------

  const ConversationCard = ({
    conversation,
    detailed = false,
  }) => {
    const isFacebook = conversation.platform === 'facebook'

    return (
      <div
        className={
          detailed ? 'conversation-full' : 'conversation'
        }
      >
        <div
          className={`platform ${
            isFacebook ? 'facebook' : 'instagram'
          }`}
        >
          {isFacebook ? 'f' : '◎'}
        </div>

        <div className="conversation-main">
          <div className="conversation-header">
            <div>
              <strong>
                {conversation.account_name || 'Social Account'}
              </strong>

              <span>
                {isFacebook ? 'Facebook' : 'Instagram'}
                {conversation.author_name
                  ? ` · ${conversation.author_name}`
                  : ''}
              </span>
            </div>

            <span className="time">
              {formatDate(conversation.createdAt)}
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
              {conversation.sentiment || 'Unknown'}
            </span>

            {conversation.intent && (
              <span className="tag">
                {conversation.intent}
              </span>
            )}

            {conversation.is_question && (
              <span className="tag">Question</span>
            )}

            {conversation.is_complaint && (
              <span className="tag reply">Complaint</span>
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
                    {conversation.language || 'Unknown'}
                  </strong>
                </span>

                <span>
                  Urgency:{' '}
                  <strong>
                    {conversation.urgency || 'Unknown'}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">AI</div>

          <div>
            <h2>Social Listening</h2>
            <span>AI Dashboard</span>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-item ${
              page === 'overview' ? 'active' : ''
            }`}
            onClick={() => setPage('overview')}
          >
            <span>◫</span>
            Overview
          </button>

          <button
            className={`nav-item ${
              page === 'conversations' ? 'active' : ''
            }`}
            onClick={() => setPage('conversations')}
          >
            <span>◉</span>
            Conversations
          </button>

          <button
            className={`nav-item ${
              page === 'accounts' ? 'active' : ''
            }`}
            onClick={() => setPage('accounts')}
          >
            <span>◎</span>
            Social Accounts
          </button>

          <button
            className={`nav-item ${
              page === 'settings' ? 'active' : ''
            }`}
            onClick={() => setPage('settings')}
          >
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace">
            <div className="workspace-avatar">
              {WORKSPACE_ID.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{WORKSPACE_ID}</strong>
              <span>Workspace</span>
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
                <h1>Overview</h1>

                <p>
                  Monitor and understand conversations across
                  your social accounts.
                </p>
              </div>

              <button
                className="connect-btn"
                onClick={() => setPage('accounts')}
              >
                + Connect Facebook & Instagram
              </button>
            </header>

            <section className="stats">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Connected Accounts</span>
                  <div className="stat-icon">◎</div>
                </div>

                <strong>
                  {accountsLoading
                    ? '...'
                    : accounts.length}
                </strong>

                <p>Facebook & Instagram</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Conversations</span>
                  <div className="stat-icon">◉</div>
                </div>

                <strong>
                  {conversationsLoading
                    ? '...'
                    : conversations.length}
                </strong>

                <p>Comments analyzed</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Need Reply</span>
                  <div className="stat-icon">↩</div>
                </div>

                <strong>
                  {conversationsLoading
                    ? '...'
                    : needsReplyCount}
                </strong>

                <p>Require your attention</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Positive Sentiment</span>
                  <div className="stat-icon">☺</div>
                </div>

                <strong>
                  {conversationsLoading
                    ? '...'
                    : `${positivePercent}%`}
                </strong>

                <p>Across conversations</p>
              </div>
            </section>

            <div className="content-grid">
              {/* RECENT CONVERSATIONS */}

              <section className="panel conversations-panel">
                <div className="panel-header">
                  <div>
                    <h3>Recent Conversations</h3>

                    <p>
                      Latest comments detected by your social
                      listening engine.
                    </p>
                  </div>

                  <button
                    className="link-btn"
                    onClick={() =>
                      setPage('conversations')
                    }
                  >
                    View all
                  </button>
                </div>

                {conversationsLoading && (
                  <p>Loading conversations...</p>
                )}

                {!conversationsLoading &&
                  conversations.length === 0 && (
                    <p>No conversations yet.</p>
                  )}

                {!conversationsLoading &&
                  conversations
                    .slice(0, 3)
                    .map((conversation) => (
                      <ConversationCard
                        key={conversation.id}
                        conversation={conversation}
                      />
                    ))}
              </section>

              {/* CONNECTED ACCOUNTS */}

              <section className="panel accounts-panel">
                <div className="panel-header">
                  <div>
                    <h3>Connected Accounts</h3>
                    <p>Accounts currently monitored.</p>
                  </div>
                </div>

                {accountsLoading && (
                  <p>Loading connected accounts...</p>
                )}

                {!accountsLoading &&
                  accounts
                    .slice(0, 4)
                    .map((account) => (
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
                          <strong>{account.name}</strong>
                          <span>{account.type}</span>
                        </div>

                        <span className="status">
                          Connected
                        </span>
                      </div>
                    ))}

                <button
                  className="secondary-btn"
                  onClick={() => setPage('accounts')}
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
                <h1>Conversations</h1>

                <p>
                  View comments detected and analyzed by your
                  AI Social Listening Engine.
                </p>
              </div>

              <button
                className="secondary-btn refresh-btn"
                onClick={loadConversations}
              >
                Refresh
              </button>
            </header>

            <section className="panel conversations-page">
              <div className="panel-header">
                <div>
                  <h3>Social Conversations</h3>

                  <p>
                    {conversations.length} conversations
                    detected for this workspace.
                  </p>
                </div>
              </div>

              {conversationsLoading && (
                <p>Loading conversations...</p>
              )}

              {conversationsError && (
                <p>Unable to load conversations.</p>
              )}

              {!conversationsLoading &&
                conversations.length === 0 && (
                  <div className="empty-state">
                    <h3>No conversations yet</h3>

                    <p>
                      New Facebook and Instagram comments
                      will appear here automatically.
                    </p>
                  </div>
                )}

              {!conversationsLoading &&
                conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                    detailed
                  />
                ))}
            </section>
          </>
        )}

        {/* SOCIAL ACCOUNTS */}

        {page === 'accounts' && (
          <>
            <header className="topbar">
              <div>
                <h1>Social Accounts</h1>

                <p>
                  Connect and manage the Facebook and
                  Instagram accounts you want to monitor.
                </p>
              </div>

              <button
                className="connect-btn"
                onClick={connectMeta}
              >
                + Connect Facebook & Instagram
              </button>
            </header>

            <section className="accounts-connect-card">
              <div className="connect-logo">◎</div>

              <div className="connect-copy">
                <h2>Connect your Meta accounts</h2>

                <p>
                  Connect Facebook once and choose the Pages
                  and Instagram accounts your business wants
                  to monitor.
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
                  <h3>Connected accounts</h3>

                  <p>
                    These accounts are currently connected to
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
                <p>Loading connected accounts...</p>
              )}

              {accountsError && (
                <p>
                  Unable to load connected accounts.
                </p>
              )}

              {!accountsLoading &&
                accounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                  />
                ))}
            </section>
          </>
        )}

        {/* SETTINGS */}

        {page === 'settings' && (
          <>
            <header className="topbar">
              <div>
                <h1>Settings</h1>

                <p>
                  Manage your workspace and application
                  settings.
                </p>
              </div>
            </header>

            <section className="panel">
              <h3>Workspace</h3>

              <p>
                <strong>Workspace ID:</strong>{' '}
                {WORKSPACE_ID}
              </p>

              <p>
                This dashboard loads social accounts and
                conversations only for this workspace.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App