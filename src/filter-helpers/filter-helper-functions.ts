import { FilterBars } from "..";

type FilterQueryHandler<Tobj> = (params: FilterBars.FilterQuery<Tobj>) => void;
