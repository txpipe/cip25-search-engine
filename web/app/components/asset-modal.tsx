

import { Dialog } from '@headlessui/react'
import { PropsWithChildren, useMemo } from 'react';

import { OuraRecord } from '~/fetching'

import { Tab } from '@headlessui/react'
import classNames from 'classnames';

import { ArrowCircleDownIcon } from '@heroicons/react/outline'
import { AssetFile, rawIpfsUriToBrowserUrl, yieldAssetFiles, yieldAssetProperties } from '~/parsing';
import { Link } from 'remix';

function NiceTabPanel(props: PropsWithChildren<{}>) {
    return (<Tab.Panel className="flex flex-col flex-grow">{props.children}</Tab.Panel>)
}

function NiceTab(props: { label: string, selected: boolean }) {
    const classes = classNames("mr-2", "rounded-md", "shadow-sm", "font-semibold", "text-base", "px-4", "py-2", {
        "bg-indigo-500": props.selected,
        "text-white": props.selected,
        "bg-gray-100": !props.selected,
        "text-gray-500": !props.selected,
    });

    return (
        <div className={classes}>{props.label}</div>
    )
}

function FileRow(props: { dto: AssetFile }) {
    const { dto } = props;

    const externalUrl = useMemo(() => rawIpfsUriToBrowserUrl(dto.src), [dto]);

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className='text-lg'>{dto.name || "default"}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-4 py-2 inline-flex text-lg leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {dto.mediaType || "unknown"}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href={externalUrl} target="_blank">
                    <ArrowCircleDownIcon className="h-10 text-indigo-500" />
                </a>
            </td>
        </tr>
    )
}


function Files(props: { dto: OuraRecord }) {
    const files = yieldAssetFiles(props.dto.cip25_asset.raw_json);

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Media Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {Array.from(files).map((file, idx) => <FileRow key={idx} dto={file} />)}
            </tbody>
        </table>
    )
}

function MetadataRow(props: { name: string, value?: string }) {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="px-4 py-2 inline-flex text-sm text-gray-500 leading-5 rounded-full bg-amber-200">{props.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-md text-gray-600">
                    {props.value}
                </span>
            </td>
        </tr>
    )
}

function Metadata(props: { dto: OuraRecord }) {
    const properties = yieldAssetProperties(props.dto.cip25_asset.raw_json);

    return (
        <div className="flex flex-col flex-grow basis-0 overflow-auto">
            <table className="divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from(properties).map(property => <MetadataRow name={property.propertyKey} value={property.stringValue} />)}
                </tbody>
            </table>
        </div>
    )
}

function BlockhainPanelRow(props: PropsWithChildren<{ name: string }>) {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="px-4 py-2 inline-flex text-sm text-gray-500 leading-5 rounded-full bg-amber-200">{props.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {props.children}
            </td>
        </tr>
    )
}

function BlockchainPanel(props: { dto: OuraRecord }) {
    return (
        <div className="flex flex-col flex-grow basis-0 overflow-auto">
            <table className="divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <BlockhainPanelRow name="Block Hash">
                        {props.dto.context.block_hash}
                    </BlockhainPanelRow>
                    <BlockhainPanelRow name="Block Number">
                        {props.dto.context.block_number}
                    </BlockhainPanelRow>
                    <BlockhainPanelRow name="Slot">
                        {props.dto.context.slot}
                    </BlockhainPanelRow>
                    <BlockhainPanelRow name="Tx Hash">
                        {props.dto.context.tx_hash}
                    </BlockhainPanelRow>
                </tbody>
            </table>
        </div>
    )
}

export default function AssetModal(props: {
    open: boolean,
    dto?: OuraRecord,
    onClose: () => void,
}) {
    const { dto } = props;

    if (!dto) return null;

    return (
        <Dialog open={props.open} onClose={props.onClose} className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />

            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform align-middle lg:w-3/5 xs:w-full h-[80%] flex flex-col items-stretch px-4 pt-5 pb-4 sm:p-6 sm:pb-4 min-h-0">
                <Dialog.Title className="text-gray-800 text-3xl mb-3">{dto.cip25_asset.name || dto.cip25_asset.asset}</Dialog.Title>

                <Dialog.Description className="mb-3 text-gray-600">
                    <p className="text-gray-400">policy:</p>
                    <Link to={`/policies/${dto.cip25_asset.policy}`} className="outline-none underline text-indigo-500">
                        {dto.cip25_asset.policy}
                    </Link>
                </Dialog.Description>

                <Tab.Group defaultIndex={0}>
                    <Tab.List className="bg-gray-200 rounded-md p-2 mb-2">
                        <Tab>{({ selected }) => <NiceTab selected={selected} label="Metadata" />}</Tab>
                        <Tab>{({ selected }) => <NiceTab selected={selected} label="Files" />}</Tab>
                        <Tab>{({ selected }) => <NiceTab selected={selected} label="Blockchain" />}</Tab>
                        <Tab>{({ selected }) => <NiceTab selected={selected} label="JSON" />}</Tab>
                    </Tab.List>
                    <Tab.Panels className="flex flex-col items-stretch flex-grow">
                        <NiceTabPanel>
                            <Metadata dto={dto} />
                        </NiceTabPanel>
                        <NiceTabPanel>
                            <Files dto={dto} />
                        </NiceTabPanel>
                        <NiceTabPanel>
                            <BlockchainPanel dto={dto} />
                        </NiceTabPanel>
                        <NiceTabPanel>
                            <pre className="bg-black p-6 overflow-scroll rounded-md flex-grow basis-0">
                                <code className="text-sky-400">{JSON.stringify(dto.cip25_asset.raw_json, undefined, 4)}</code>
                            </pre>
                        </NiceTabPanel>
                    </Tab.Panels>
                </Tab.Group>

            </div>
        </Dialog>
    )
}
