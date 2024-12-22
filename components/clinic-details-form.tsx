'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { clinicAction, doctorAction } from '@/lib/actions'
import { Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export function ClinicDetailsForm({ className }: React.ComponentProps<'div'>) {
  const [state, formAction, pending] = React.useActionState(clinicAction, {
    defaultValues: {
      hcCode: '',
      contactNumber: '',
    },
    success: false,
    errors: null,
  })

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>Clinic and Doctor Details</CardTitle>
        <CardDescription>
          Update your clinic and doctor information
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.success ? (
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Clinic details have been saved successfully.
            </p>
          ) : null}
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.hcCode}
          >
            <Label
              htmlFor="hcCode"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Healthcare Institution (HC) code <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="hcCode"
              name="hcCode"
              placeholder="1234567"
              maxLength={7}
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.hcCode}
              aria-errormessage="error-hcCode"
              defaultValue={state.defaultValues.hcCode}
            />
            {state.errors?.hcCode && (
              <p id="error-hcCode" className="text-destructive text-sm">
                {state.errors.hcCode}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.contactNumber}
          >
            <Label
              htmlFor="contactNumber"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Clinic contact number
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                +65
              </span>
              <Input
                id="contactNumber"
                name="contactNumber"
                placeholder="91234567"
                maxLength={8}
                className={cn(
                  'rounded-l-none',
                  'group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive'
                )}
                disabled={pending}
                aria-invalid={!!state.errors?.contactNumber}
                aria-errormessage="error-contactNumber"
                defaultValue={state.defaultValues.contactNumber}
              />
            </div>
            {state.errors?.contactNumber && (
              <p id="error-contactNumber" className="text-destructive text-sm">
                {state.errors.contactNumber}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Clinic Details'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

