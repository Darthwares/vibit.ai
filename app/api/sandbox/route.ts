import { FragmentSchema } from '@/lib/schema'
import { ExecutionResultInterpreter, ExecutionResultWeb } from '@/lib/types'
import { Sandbox } from '@e2b/code-interpreter'

const sandboxTimeout = 10 * 60 * 1000 // 10 minute in ms

export const maxDuration = 60

export async function POST(req: Request) {
  const {
    fragment,
    userID,
    teamID,
    accessToken,
  }: {
    fragment: FragmentSchema
    userID: string | undefined
    teamID: string | undefined
    accessToken: string | undefined
  } = await req.json()
  console.log('fragment', fragment)
  console.log('userID', userID)
  console.log('E2B_API_KEY exists:', !!process.env.E2B_API_KEY)
  console.log('E2B_API_KEY length:', process.env.E2B_API_KEY?.length || 0)

  if (!process.env.E2B_API_KEY) {
    console.error('E2B_API_KEY is not set in environment variables')
    return new Response(
      JSON.stringify({ error: 'E2B API key not configured' }),
      { status: 500 }
    )
  }

  // Create an interpreter or a sandbox
  let sbx
  try {
    sbx = await Sandbox.create(fragment.template, {
      apiKey: process.env.E2B_API_KEY,
      metadata: {
        template: fragment.template,
        userID: userID ?? '',
        teamID: teamID ?? '',
      },
      timeoutMs: sandboxTimeout,
      ...(teamID && accessToken
        ? {
            headers: {
              'X-Firebase-Team': teamID,
              'X-Firebase-Token': accessToken,
            },
          }
        : {}),
    })
  } catch (error: any) {
    console.error('Sandbox creation error:', error)
    console.error('Error details:', error.message)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create sandbox',
        details: error.message,
        apiKeySet: !!process.env.E2B_API_KEY
      }),
      { status: 500 }
    )
  }

  // Install packages
  if (fragment.has_additional_dependencies) {
    await sbx.commands.run(fragment.install_dependencies_command)
    console.log(
      `Installed dependencies: ${fragment.additional_dependencies.join(', ')} in sandbox ${sbx.sandboxId}`,
    )
  }

  // Copy code to fs
  if (fragment.code && Array.isArray(fragment.code)) {
    fragment.code.forEach(async (file) => {
      await sbx.files.write(file.file_path, file.file_content)
      console.log(`Copied file to ${file.file_path} in ${sbx.sandboxId}`)
    })
  } else {
    await sbx.files.write(fragment.file_path, fragment.code)
    console.log(`Copied file to ${fragment.file_path} in ${sbx.sandboxId}`)
  }

  // Execute code or return a URL to the running sandbox
  if (fragment.template === 'code-interpreter-v1') {
    const { logs, error, results } = await sbx.runCode(fragment.code || '')

    return new Response(
      JSON.stringify({
        sbxId: sbx?.sandboxId,
        template: fragment.template,
        stdout: logs.stdout,
        stderr: logs.stderr,
        runtimeError: error,
        cellResults: results,
      } as ExecutionResultInterpreter),
    )
  }

  return new Response(
    JSON.stringify({
      sbxId: sbx?.sandboxId,
      template: fragment.template,
      url: `https://${sbx?.getHost(fragment.port || 80)}`,
    } as ExecutionResultWeb),
  )
}