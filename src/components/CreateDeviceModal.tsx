import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateDevice: (device: {
    device_type: string;
    name: string;
    description: string;
    block_id: string;
  }) => void;
}

const deviceTypes = [
  { value: "pump", label: "Pump" },
  { value: "valve", label: "Valve" },
  { value: "tank", label: "Tank" },
  { value: "sump", label: "Sump" },
];

const availableBlocks = [
  { id: "block-a", name: "Block A" },
  { id: "block-b", name: "Block B" },
  { id: "block-c", name: "Block C" },
  { id: "block-d", name: "Block D" },
];

export function CreateDeviceModal({
  open,
  onOpenChange,
  onCreateDevice,
}: CreateDeviceModalProps) {
  const [deviceType, setDeviceType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [blockId, setBlockId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceType && name && blockId) {
      onCreateDevice({
        device_type: deviceType,
        name,
        description,
        block_id: blockId,
      });
      // Reset form
      setDeviceType("");
      setName("");
      setDescription("");
      setBlockId("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Device</DialogTitle>
          <DialogDescription>
            Add a new device to your organization. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="device-type" className="text-right">
                Device Type
              </Label>
              <Select value={deviceType} onValueChange={setDeviceType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Enter device name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter device description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="block" className="text-right">
                Block
              </Label>
              <Select value={blockId} onValueChange={setBlockId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select block" />
                </SelectTrigger>
                <SelectContent>
                  {availableBlocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}