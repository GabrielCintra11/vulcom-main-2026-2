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

/**
 * ATIVIDADE 07/11 - Exposição da vulnerabilidade de sequestro de sessão.
 *
 * Demonstração didática: um script JavaScript executado no contexto da
 * aplicação consegue ler TODAS as entradas do Local Storage, incluindo
 * o token JWT de autenticação armazenado após o login. Em um cenário
 * real, um ataque de XSS (A05) poderia capturar esse token e sequestrar
 * a sessão do usuário.
 *
 * Esta demonstração usa apenas os dados da própria aplicação.
 */
export default function Homepage() {

  const [entries, setEntries] = React.useState([])

  function readLocalStorage() {
    const list = []
    // Lê todas as entradas do Local Storage, como faria um script malicioso
    for(let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      list.push({
        key,
        value: window.localStorage.getItem(key)
      })
    }
    setEntries(list)
  }

  React.useEffect(() => {
    readLocalStorage()
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
          <code> window.localStorage</code>. Se o token JWT de autenticação for
          gravado nele após o login, qualquer ataque de XSS bem-sucedido (A05)
          permite ao invasor capturar o token e sequestrar a sessão do usuário.
        </Typography>

        <Typography gutterBottom>
          Faça login e observe que a entrada <code>_auth</code> (o token JWT)
          aparece na lista abaixo, com sua chave e seu valor completos,
          legíveis por JavaScript:
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={readLocalStorage}
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
    </>
  )
}