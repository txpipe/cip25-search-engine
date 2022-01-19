import { PropsWithChildren } from "react";

export function NiceSubmitButton(props: PropsWithChildren<{}>) {
    return (
        <button type="submit" className="shadow flex items-center justify-center px-8 py-3  text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            {props.children}
        </button>
    );
}
