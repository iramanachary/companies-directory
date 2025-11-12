import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "./index";
import { Search, Funnel } from 'lucide-react'

const Index = ({ tableColumns, tableData, setSearchQuery, searchQuery, modelHandler, resetFilters }) => {
    return (
        <div className="overflow-hidden rounded-sm border p-6 border-gray-200 bg-white  ">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">Companies Directory</h1>
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <button onClick={modelHandler} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 ">
                        <Funnel className="size-5" />
                        Filter
                    </button>
                    <button onClick={resetFilters} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                       Reset Filter
                    </button>
                </div>

            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 ">
                        <TableRow>
                            {
                                tableColumns && tableColumns.length > 0 &&
                                tableColumns.map((column, index) =>
                                    <TableCell
                                        key={index}
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                    >
                                        {column}
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 ">
                        {tableData.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                                    {order.name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                                    {order.location}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                                    {order.industry}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Index;