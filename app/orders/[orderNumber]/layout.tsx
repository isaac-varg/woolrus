
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-6 py-8 px-12">

      <div className="flex flex-col gap-y-6">
        {children}
      </div>
    </div>

  )
}

export default layout
