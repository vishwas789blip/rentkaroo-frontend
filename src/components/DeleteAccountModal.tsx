interface Props{
open:boolean
onClose:()=>void
onConfirm:()=>void
}

export default function DeleteAccountModal({
open,
onClose,
onConfirm
}:Props){

if(!open)return null

return(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-lg w-[400px] space-y-4">

<h2 className="text-lg font-semibold text-red-600">
Delete Account
</h2>

<p className="text-sm text-gray-600">
This action cannot be undone.
</p>

<div className="flex justify-end gap-3">

<button
onClick={onClose}
className="px-4 py-2 border rounded"
>
Cancel
</button>

<button
onClick={onConfirm}
className="px-4 py-2 bg-red-600 text-white rounded"
>
Delete
</button>

</div>

</div>

</div>

)
}