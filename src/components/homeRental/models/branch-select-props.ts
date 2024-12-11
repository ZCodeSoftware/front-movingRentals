export interface IBranchSelectProps {
  branch: string
  onBranchChange: (branch: string) => void
  loading: Record<string, boolean>
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}
