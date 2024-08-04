'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [additions, setAdditions] = useState(0)
  const [deletions, setDeletions] = useState(0)
  const [recentActivities, setRecentActivities] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [search, setSearch] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    let total = 0
    docs.forEach((doc) => {
      const data = doc.data()
      inventoryList.push({
        name: doc.id,
        ...data,
      })
      total += data.quantity
    })
    setInventory(inventoryList)
    setTotalQuantity(total)
    setTotalItems(inventoryList.length) // Set the total number of unique items
  }

  const addItem = async (item) => {
    if (!item.trim()) return // Check for empty item name
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    setAdditions(prev => prev + 1)
    setRecentActivities(prev => [...prev, `Added ${item}`])
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    setDeletions(prev => prev + 1)
    setRecentActivities(prev => [...prev, `Removed ${item}`])
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={2}
      bgcolor="#f0f0f0"
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined" onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Adjusted the position of the top statistics boxes */}
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        padding={2}
        border="1px solid #333"
        bgcolor="#FFF"
        boxShadow={2}
      >
        <Box padding={2} border="1px solid #333" bgcolor="#D3D3D3">
          <Typography variant="h6">Total Quantity: {totalQuantity}</Typography>
        </Box>
        <Box padding={2} border="1px solid #333" bgcolor="#D3D3D3">
          <Typography variant="h6">Total Items: {totalItems}</Typography>
        </Box>
        <Box padding={2} border="1px solid #333" bgcolor="#D3D3D3">
          <Typography variant="h6">Additions: {additions}</Typography>
        </Box>
        <Box padding={2} border="1px solid #333" bgcolor="#D3D3D3">
          <Typography variant="h6">Deletions: {deletions}</Typography>
        </Box>
      </Box>

      {/* Positioned the Add new Item button and search filter */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        padding={2}
        gap={2}
        position="absolute"
        top="110px"
        left="80px"
      >
        <Button variant="contained" onClick={handleOpen}>
          Add new Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "500px" }}
        />
        {/* Inventory list positioned below the search filter */}
        <Box
          width="500px"
          border="1px solid #333"
          bgcolor="#FFF"
          boxShadow={2}
          overflow="auto"
          height="300px"
        >
          <Stack spacing={2}>
            {inventory
              .filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
              .map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  padding={2}
                  bgcolor="#f0f0f0"
                >
                  <Typography variant="body1" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body1" color="#333" textAlign="center">
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => {
                      addItem(name)
                    }}
                    >
                      Add
                    </Button>
                    <Button variant="contained" onClick={() => {
                      removeItem(name)
                    }}
                    >
                      Remove
                    </Button></Stack>
                </Box>
              ))}
          </Stack>
        </Box>
      </Box>
      {/* Two New Boxes Aligned with Inventory List */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="1150px"  // Same width as the inventory list container
        height="425px"  // Height matching the Add new Item button
        position="absolute"
        right="100px"
        top="126px" // Adjust position to align with the search filter and inventory list
        gap={9.5}
      >
        <Box
          flex="1"
          border="1px solid #333"
          bgcolor="#D3D3D3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6">Whats Next: Integrating GPT Visision API to classify Images </Typography>
        </Box>
        <Box
          flex="1"
          border="1px solid #333"
          bgcolor="#D3D3D3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6">Add a suggestion feature using Open AI API</Typography>
        </Box>
      </Box>

      {/* Recent Activities box positioned at the bottom */}
      <Box
        position="absolute"
        bottom={20}
        left={95}
        width="90%"
        height="300px"
        padding={2}
        border="1px solid #333"
        bgcolor="#FFF"
        boxShadow={2}
        overflow="auto"
      >
        <Typography variant="h6" color="#333">Recent Activities</Typography>
        <Stack spacing={1}>
        {recentActivities.slice().reverse().map((activity, index) => (  // Added .slice().reverse()
            <Typography key={index} variant="body1" color="#333">
              {activity}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}