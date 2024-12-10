import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-center mt-4 space-x-4">
            <Button onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50">
                Previous
            </Button>
            <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50">
                    Next
                </Button>
        </div>
    );
};