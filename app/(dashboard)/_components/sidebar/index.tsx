import NewButton from './NewButton'
import OrgList from './OrgList'

export const Sidebar = () => {
    console.log('sidebar')
    return (
        <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex p-3 flex-col gap-y-4 text-white">
            <OrgList />
            <NewButton />
        </aside>
    )
}
