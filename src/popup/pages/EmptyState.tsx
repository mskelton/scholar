import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import { AddSite } from './AddSite'

export function EmptyState() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <PlusIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome to Learning Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Start tracking your progress on documentation websites
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              No sites added yet. Add your first documentation site to get
              started!
            </p>
            <Link component={AddSite}>
              <Button className="w-full" size="lg">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
