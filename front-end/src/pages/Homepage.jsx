import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'
import WarningIcon from '@mui/icons-material/Warning'
import LockIcon from '@mui/icons-material/Lock'

/**
 * ATIVIDADE 07/11 - Exposição da vulnerabilidade de sequestro de sessão.
 *
 * Demonstração didática: um script JavaScript executado no contexto da
 * aplicação consegue ler TODAS as entradas do Local Storage. Enquanto o
 * token JWT era gravado nele após o login, qualquer ataque de XSS (A05)
 * poderia capturar o token e sequestrar a sessão do usuário.
 *
 * ATIVIDADE 14/11 - Demonstração de cookies HTTP-only:
 * o script também consegue ler apenas os cookies NÃO HTTP-only via
 * document.cookie. O cookie "cookie-js" (definido no back-end para a
 * demonstração) aparece, mas o cookie de autenticação HTTP-only (_auth)
 * NÃO aparece.
 *
 * Esta demonstração usa apenas os dados da própria aplicação.
 */
export default function Homepage() {

  const [entries, setEntries] = React.useState([])
  const [cookies, setCookies] = React.useState([])

  function readStorages() {
    // Lê todas as entradas do Local Storage, como faria um script malicioso
    const list = []
    for(let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      list.push({
        key,
        value: window.localStorage.getItem(key)
      })
    }
    setEntries(list)

    // Lê os cookies acessíveis por JavaScript via document.cookie.
    // Cookies HTTP-only NÃO aparecem aqui — essa é a proteção demonstrada.
    const cookieList = document.cookie
      .split('; ')
      .filter(Boolean)
      .map(item => {
        const eq = item.indexOf('=')
        return {
          key: item.slice(0, eq),
          value: decodeURIComponent(item.slice(eq + 1))
        }
      })
    setCookies(cookieList)
  }

  React.useEffect(() => {
    readStorages()
  }, [])

  return(
    <>
      <Typography variant="h1" gutterBottom>
        Projeto VULCOM
      </Typography>
      
      <Typography>
        Sistema para análise e estudo de vulnerabilidades comuns  
      </Typography>

      {/*** Demonstração da vulnerabilidade de sequestro de sessão (07/11) ***/}
      <Paper
        elevation={3}
        sx={{
          padding: '24px',
          maxWidth: '860px',
          margin: '32px auto'
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Vulnerabilidade: sequestro de sessão
        </Typography>

        <Typography gutterBottom>
          A qualquer momento, um script JavaScript executado no contexto desta
          página consegue ler <strong>todas</strong> as entradas do
          <strong> Local Storage</strong> por meio de
          <code> window.localStorage</code>. Quando o token JWT era gravado nele
          após o login, qualquer ataque de XSS bem-sucedido (A05) permitia ao
          invasor capturar o token e sequestrar a sessão do usuário.
        </Typography>

        <Typography gutterBottom>
          Após a migração para o cookie HTTP-only (atividade 11/11), observe
          que o token <strong>não aparece mais</strong> na lista abaixo:
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={readStorages}
          startIcon={<RefreshIcon />}
          sx={{ mb: 2, mt: 1 }}
        >
          Ler o Local Storage novamente
        </Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Chave</strong></TableCell>
              <TableCell><strong>Valor</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  Nenhuma entrada encontrada no Local Storage.
                </TableCell>
              </TableRow>
            )}
            {entries.map(entry => (
              <TableRow key={entry.key}>
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {entry.key}
                </TableCell>
                <TableCell sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {entry.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/*** Demonstração de cookies HTTP-only (14/11) ***/}
      <Paper
        elevation={3}
        sx={{
          padding: '24px',
          maxWidth: '860px',
          margin: '32px auto'
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon color="success" />
          Proteção: cookies HTTP-only
        </Typography>

        <Typography gutterBottom>
          Por meio de <code>document.cookie</code>, o JavaScript consegue ler
          apenas os cookies <strong>não HTTP-only</strong>. O cookie
          <code> cookie-js</code>, criado pelo back-end para esta demonstração,
          aparece na lista abaixo. Já o cookie de autenticação HTTP-only
          (<code>_auth</code>) <strong>não aparece</strong>: o navegador o envia
          automaticamente nas requisições, mas o impede de ser lido por
          JavaScript.
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={readStorages}
          startIcon={<RefreshIcon />}
          sx={{ mb: 2, mt: 1 }}
        >
          Ler os cookies novamente
        </Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Valor (acessível via document.cookie)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cookies.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  Nenhum cookie acessível via JavaScript.
                </TableCell>
              </TableRow>
            )}
            {cookies.map(cookie => (
              <TableRow key={cookie.key}>
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {cookie.key}
                </TableCell>
                <TableCell sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {cookie.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}