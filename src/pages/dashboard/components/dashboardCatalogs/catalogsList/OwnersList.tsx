import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllVehicleOwners } from '../../../../../services/owners/GET/vehicle-owners.get.service'
import { IVehicleOwners } from '../../../../../services/owners/models/vehicle-owners.interface'
import UpdateOwner from '../updateCatalogs/updateOwner'

const OwnerList = () => {
  const [loading, setLoading] = useState(true)
  const [OwnersData, setOwnersData] = useState<IVehicleOwners[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedOwner, setselectedOwner] = useState<IVehicleOwners | null>(null)

  const getData = async () => {
    const result = await fetchAllVehicleOwners()
    setOwnersData(result)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleEditClick = (owner: IVehicleOwners) => {
    setselectedOwner(owner)
    setOpenUpdateModal(true)
  }

  return (
    <>
      {!loading && (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table aria-label='Tabla de usuarios'>
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Porcentaje de comisión</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {OwnersData.map(t => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.commissionPercentage}</TableCell>
                  <TableCell>
                    <Button
                      onPress={() => {
                        handleEditClick(t)
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedOwner && openUpdateModal && (
        <UpdateOwner
          ownerData={selectedOwner}
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          ownerId={selectedOwner._id}
          onUpdate={getData}
        />
      )}
    </>
  )
}

export default OwnerList
