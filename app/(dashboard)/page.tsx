'use client'

import { useOrganization } from '@clerk/nextjs'
import EmptyOrganisation from './_components/EmptyOrganisation'
import BoardList from './_components/BoardList'

interface DashboardPageProps {
    searchParams: {
        search?: string
        favorites?: string
    }
}

const Dashboard = ({ searchParams }: DashboardPageProps) => {
    const { organization } = useOrganization()
    return (
        <div className="flex-1 h-[calc(100%-80px)] p-6">
            {!organization ? (
                <EmptyOrganisation />
            ) : (
                <BoardList orgId={organization.id} query={searchParams} />
            )}
        </div>
    )
}

export default Dashboard
