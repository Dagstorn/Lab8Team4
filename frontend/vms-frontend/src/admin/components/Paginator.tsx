import { Button } from "@/shared/shad-ui/ui/button";
import { PaginatorObj } from "@/shared/types/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const Paginator = ({ getData, paginatorData }: { getData: (page: number) => void, paginatorData: PaginatorObj }) => {
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPaginationObj(paginatorData);
    }, [paginatorData]);

    const prevPage = () => {
        if (page > 1) {
            getData(page - 1);
            setPage((prevPage) => prevPage - 1);
        }
    }

    const nextPage = (paginationObj: PaginatorObj) => {
        if (page < paginationObj.page_size) {
            getData(page + 1);
            setPage((prevPage) => prevPage + 1);
        }
    }

    const paginationBtn = (pageNum: number, paginationObj: PaginatorObj) => {
        if (pageNum > 0 && pageNum <= paginationObj.page_size) {
            getData(pageNum);
            setPage(pageNum);
        }
    }

    const pageLinks = (paginationObj: PaginatorObj) => {
        const elementsArray = Array.from({ length: paginationObj.page_size }, (_, index) => (
            <Button
                onClick={() => paginationBtn(index + 1, paginationObj)}
                key={index}
                variant={page === index + 1 ? "default" : "secondary"}
            >
                {index + 1}
            </Button >
        ));

        return (
            <div className="flex justify-center items-center gap-2 ">
                {elementsArray}
            </div>
        );
    }


    return (
        <>
            {paginationObj && <div className="mt-4 flex justify-center items-center gap-2">
                <Button className="py-1 px-3" onClick={prevPage}
                    disabled={paginationObj.previous === null}>
                    <ChevronLeft className="w-4" />
                </Button>
                {pageLinks(paginationObj)}
                <Button className="py-1 px-3" onClick={() => nextPage(paginationObj)}
                    disabled={paginationObj.next === null} >
                    <ChevronRight className="w-4" />
                </Button>
            </div>}

        </>
    )
}

export default Paginator