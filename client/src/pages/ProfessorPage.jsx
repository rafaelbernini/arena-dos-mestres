import { useMemo, useState } from 'react';

const PIN = '1234';

function formatDate(value) {
  if (!value) {
    return '--';
  }

  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(seconds) {
  if (seconds == null) {
    return '--';
  }

  return `${Number(seconds).toFixed(1)}s`;
}

function StatCard({ label, value, tone = '#a78bfa' }) {
  return (
    <div style={{
      background: '#120a2d',
      border: '1px solid #2a1d50',
      borderRadius: 14,
      padding: 16
    }}>
      <div style={{ fontSize: 12, color: '#7c6aa8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: tone }}>{value}</div>
    </div>
  );
}

export default function ProfessorPage() {
  const [report, setReport] = useState(null);
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/scores/report');
      if (!response.ok) {
        throw new Error('Nao foi possivel carregar o relatorio');
      }
      setReport(await response.json());
    } catch (err) {
      setError(err.message || 'Erro ao carregar relatorio');
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const sessions = report?.sessions || [];
    const players = report?.players || [];
    const attempts = players.reduce((total, player) => total + (player.total_attempts || 0), 0);
    const connected = players.filter((player) => player.connected).length;

    return {
      sessions: sessions.length,
      players: players.length,
      attempts,
      connected
    };
  }, [report]);

  if (!auth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #22104d, #07041a 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}>
        <div style={{
          width: '100%',
          maxWidth: 380,
          background: 'rgba(15, 9, 35, 0.96)',
          border: '1px solid #2f1f57',
          borderRadius: 18,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)'
        }}>
          <div style={{ color: '#d9d1ff', fontSize: 28, fontWeight: 700 }}>Painel do Professor</div>
          <div style={{ color: '#8a7ab8', fontSize: 14 }}>
            Entre com o PIN para acompanhar sessoes, tempo por aluno e atividade recente.
          </div>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN de 4 digitos"
            style={{
              background: '#1a1040',
              border: '1px solid #3d2d70',
              borderRadius: 10,
              padding: '12px 14px',
              color: '#fff',
              fontSize: 18,
              textAlign: 'center'
            }}
          />
          <button
            onClick={() => {
              if (pin === PIN) {
                setAuth(true);
                load();
                return;
              }
              alert('PIN incorreto');
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              padding: '12px 18px',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #07041a 0%, #110927 100%)',
      padding: 20,
      fontFamily: 'Inter, sans-serif',
      color: '#f4f1ff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
        flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30 }}>Painel do Professor</h2>
          <div style={{ color: '#8a7ab8', marginTop: 6 }}>
            Relatorio de sessoes, desempenho por aluno e historico recente.
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            background: '#1a1040',
            border: '1px solid #2a1d50',
            borderRadius: 10,
            color: '#c4b5fd',
            padding: '10px 16px',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Atualizando...' : 'Atualizar relatorio'}
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(127, 29, 29, 0.25)',
          border: '1px solid #7f1d1d',
          color: '#fecaca',
          padding: 14,
          borderRadius: 12,
          marginBottom: 16
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 18
      }}>
        <StatCard label="Sessoes registradas" value={summary.sessions} />
        <StatCard label="Alunos no historico" value={summary.players} />
        <StatCard label="Tentativas totais" value={summary.attempts} />
        <StatCard label="Alunos conectados" value={summary.connected} tone="#34d399" />
      </div>

      {report?.stuck?.length > 0 && (
        <section style={{
          background: 'rgba(69, 10, 10, 0.45)',
          border: '1px solid #7f1d1d',
          borderRadius: 16,
          padding: 16,
          marginBottom: 18
        }}>
          <div style={{ fontSize: 13, color: '#fca5a5', marginBottom: 10, fontWeight: 700 }}>
            Alunos travados ha mais de 5 minutos
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {report.stuck.map((item) => (
              <div key={`${item.nickname}-${item.last_updated}`} style={{
                background: 'rgba(17, 24, 39, 0.35)',
                borderRadius: 10,
                padding: 12,
                color: '#ffe4e6'
              }}>
                <strong>{item.nickname}</strong> na sessao <strong>{item.session_code || '--'}</strong>,
                sala <strong>{item.current_room_id}</strong> ({item.room_name || 'sem nome'}),
                fase <strong>{item.current_phase}</strong> e parado ha <strong>{item.minutes_idle} min</strong>.
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{
        background: '#0d0721',
        border: '1px solid #21133f',
        borderRadius: 16,
        padding: 16,
        marginBottom: 18
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Sessoes</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ color: '#8a7ab8', textAlign: 'left' }}>
                {['Sessao', 'Inicio', 'Fim', 'Alunos', 'Respostas', 'Tempo medio', 'Acerto'].map((label) => (
                  <th key={label} style={{ padding: '10px 8px', borderBottom: '1px solid #1f1637' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(report?.sessions || []).map((session) => (
                <tr key={session.id} style={{ borderBottom: '1px solid #151027' }}>
                  <td style={{ padding: '10px 8px', color: '#ddd6fe', fontWeight: 700 }}>{session.session_code}</td>
                  <td style={{ padding: '10px 8px' }}>{formatDate(session.started_at)}</td>
                  <td style={{ padding: '10px 8px' }}>{session.ended_at ? formatDate(session.ended_at) : 'Ativa'}</td>
                  <td style={{ padding: '10px 8px' }}>{session.players_count}</td>
                  <td style={{ padding: '10px 8px' }}>{session.total_responses}</td>
                  <td style={{ padding: '10px 8px' }}>{formatDuration(session.avg_response_time)}</td>
                  <td style={{ padding: '10px 8px', color: session.accuracy >= 70 ? '#34d399' : '#fbbf24' }}>
                    {session.accuracy}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{
        background: '#0d0721',
        border: '1px solid #21133f',
        borderRadius: 16,
        padding: 16,
        marginBottom: 18
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Alunos</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1180 }}>
            <thead>
              <tr style={{ color: '#8a7ab8', textAlign: 'left' }}>
                {['Aluno', 'Sessao', 'Sala atual', 'Fase', 'Tentativas', 'Acerto', 'Tempo medio', 'Maior tempo', 'Pistas', 'Salas jogadas', 'Ultima atividade'].map((label) => (
                  <th key={label} style={{ padding: '10px 8px', borderBottom: '1px solid #1f1637' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(report?.players || []).map((player) => (
                <tr key={player.id} style={{ borderBottom: '1px solid #151027' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ fontWeight: 700, color: '#ddd6fe' }}>{player.nickname}</div>
                    <div style={{ color: '#8a7ab8', fontSize: 12 }}>
                      {player.hero_class} • {player.connected ? 'online' : 'offline'} • {player.total_score} pts
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>{player.session_code || '--'}</td>
                  <td style={{ padding: '10px 8px' }}>
                    {player.current_room_emoji || ''} {player.current_room_name || '--'}
                  </td>
                  <td style={{ padding: '10px 8px' }}>{player.current_phase}</td>
                  <td style={{ padding: '10px 8px' }}>{player.total_attempts}</td>
                  <td style={{ padding: '10px 8px', color: player.accuracy >= 70 ? '#34d399' : '#fbbf24' }}>
                    {player.accuracy}%
                  </td>
                  <td style={{ padding: '10px 8px' }}>{formatDuration(player.avg_response_time)}</td>
                  <td style={{ padding: '10px 8px' }}>{formatDuration(player.max_response_time)}</td>
                  <td style={{ padding: '10px 8px' }}>{player.hints_used}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <div>{player.rooms_visited}</div>
                    <div style={{ color: '#8a7ab8', fontSize: 12 }}>{player.rooms_played || '--'}</div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>{formatDate(player.last_updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{
        background: '#0d0721',
        border: '1px solid #21133f',
        borderRadius: 16,
        padding: 16,
        marginBottom: 18
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Atividade recente</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead>
              <tr style={{ color: '#8a7ab8', textAlign: 'left' }}>
                {['Quando', 'Aluno', 'Sessao', 'Sala', 'Fase', 'Tempo', 'Tentativas', 'Pista', 'Pontos', 'Resposta'].map((label) => (
                  <th key={label} style={{ padding: '10px 8px', borderBottom: '1px solid #1f1637' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(report?.recentResponses || []).map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #151027' }}>
                  <td style={{ padding: '10px 8px' }}>{formatDate(row.timestamp)}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ fontWeight: 700, color: '#ddd6fe' }}>{row.nickname}</div>
                    <div style={{ fontSize: 12, color: '#8a7ab8' }}>{row.hero_class}</div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>{row.session_code || '--'}</td>
                  <td style={{ padding: '10px 8px' }}>{row.room_emoji} {row.room_name}</td>
                  <td style={{ padding: '10px 8px' }}>{row.phase}</td>
                  <td style={{ padding: '10px 8px' }}>{formatDuration(row.response_time_s)}</td>
                  <td style={{ padding: '10px 8px' }}>{row.attempts_used}</td>
                  <td style={{ padding: '10px 8px' }}>{row.hint_used ? 'Sim' : 'Nao'}</td>
                  <td style={{ padding: '10px 8px' }}>{row.points_earned}</td>
                  <td style={{ padding: '10px 8px' }}>{row.answer_given || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{
        background: '#0d0721',
        border: '1px solid #21133f',
        borderRadius: 16,
        padding: 16
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Desempenho por fase</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ color: '#8a7ab8', textAlign: 'left' }}>
                {['Sala', 'Fase', 'Tentativas', 'Acertos', '% acerto', 'Tempo medio', 'Tentativas medias', 'Pistas'].map((label) => (
                  <th key={label} style={{ padding: '10px 8px', borderBottom: '1px solid #1f1637' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(report?.heatmap || []).map((row) => {
                const pct = row.total_attempts ? Math.round((row.correct || 0) / row.total_attempts * 100) : 0;
                return (
                  <tr key={`${row.room_id}-${row.phase}`} style={{ borderBottom: '1px solid #151027' }}>
                    <td style={{ padding: '10px 8px' }}>{row.room_id}</td>
                    <td style={{ padding: '10px 8px' }}>{row.phase}</td>
                    <td style={{ padding: '10px 8px' }}>{row.total_attempts}</td>
                    <td style={{ padding: '10px 8px' }}>{row.correct}</td>
                    <td style={{ padding: '10px 8px', color: pct >= 70 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171' }}>
                      {pct}%
                    </td>
                    <td style={{ padding: '10px 8px' }}>{formatDuration(row.avg_time)}</td>
                    <td style={{ padding: '10px 8px' }}>{Number(row.avg_attempts || 0).toFixed(1)}</td>
                    <td style={{ padding: '10px 8px' }}>{row.hints_used}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
