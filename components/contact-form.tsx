'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import { contactFormAction } from '@/lib/actions'
import { Check } from 'lucide-react'

export function ContactForm({ className }: React.ComponentProps<typeof Card>) {
  const [state, formAction, pending] = React.useActionState(contactFormAction, {
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    success: false,
    errors: null,
  })

  return (
    <div className={cn('w-full max-w-md', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">How can we help?</h3>
        <p className="text-sm text-muted-foreground">
          Need help with your project? We&apos;re here to assist you.
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        {state.success ? (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Check className="size-4" />
            Your message has been sent. Thank you.
          </p>
        ) : null}
        <div
          className="group/field grid gap-2"
          data-invalid={!!state.errors?.name}
        >
          <Label
            htmlFor="name"
            className="group-data-[invalid=true]/field:text-destructive"
          >
            Name <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Lee Robinson"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            disabled={pending}
            aria-invalid={!!state.errors?.name}
            aria-errormessage="error-name"
            defaultValue={state.defaultValues.name}
          />
          {state.errors?.name && (
            <p id="error-name" className="text-destructive text-sm">
              {state.errors.name}
            </p>
          )}
        </div>
        <div
          className="group/field grid gap-2"
          data-invalid={!!state.errors?.email}
        >
          <Label
            htmlFor="email"
            className="group-data-[invalid=true]/field:text-destructive"
          >
            Email <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="leerob@acme.com"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            disabled={pending}
            aria-invalid={!!state.errors?.email}
            aria-errormessage="error-email"
            defaultValue={state.defaultValues.email}
          />
          {state.errors?.email && (
            <p id="error-email" className="text-destructive text-sm">
              {state.errors.email}
            </p>
          )}
        </div>
        <div
          className="group/field grid gap-2"
          data-invalid={!!state.errors?.message}
        >
          <Label
            htmlFor="message"
            className="group-data-[invalid=true]/field:text-destructive"
          >
            Message <span aria-hidden="true">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Type your message here..."
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            disabled={pending}
            aria-invalid={!!state.errors?.message}
            aria-errormessage="error-message"
            defaultValue={state.defaultValues.message}
          />
          {state.errors?.message && (
            <p id="error-message" className="text-destructive text-sm">
              {state.errors.message}
            </p>
          )}
        </div>
        <div className="pt-4">
          <Button type="submit" disabled={pending}>
            {pending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </div>
  )
}

