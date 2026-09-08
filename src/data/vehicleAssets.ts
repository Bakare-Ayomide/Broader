import car3d from '../assets/images/car_3d_render_1788874308998.jpg';
import suv3d from '../assets/images/suv_3d_render_1788874323261.jpg';
import bike3d from '../assets/images/bike_3d_render_1788874339765.jpg';
import keke3d from '../assets/images/keke_3d_render_1788874383950.jpg';
import van3d from '../assets/images/van_3d_render_1788874354818.jpg';
import truck3d from '../assets/images/truck_3d_render_1788874397322.jpg';
import ambulance3d from '../assets/images/ambulance_3d_render_1788874369942.jpg';

export const VEHICLE_3D_ASSETS = {
  car: car3d,
  suv: suv3d,
  motorcycle: bike3d,
  bicycle: bike3d,
  tricycle: keke3d,
  van: van3d,
  bus: van3d,
  pickup: truck3d,
  lorry: truck3d,
  truck: truck3d,
  ambulance: ambulance3d,
};

export function getVehicle3DImage(category?: string, name?: string): string {
  const cat = (category || '').toLowerCase();
  const label = (name || '').toLowerCase();

  if (cat.includes('ambulance') || label.includes('ambulance') || label.includes('medic')) {
    return VEHICLE_3D_ASSETS.ambulance;
  }
  if (cat.includes('tricycle') || label.includes('keke') || label.includes('rickshaw')) {
    return VEHICLE_3D_ASSETS.tricycle;
  }
  if (cat.includes('bike') || cat.includes('motorcycle') || label.includes('okada') || label.includes('bike') || label.includes('cycle')) {
    return VEHICLE_3D_ASSETS.motorcycle;
  }
  if (cat.includes('suv') || label.includes('prado') || label.includes('comfort') || label.includes('executive')) {
    return VEHICLE_3D_ASSETS.suv;
  }
  if (cat.includes('van') || label.includes('van') || cat.includes('bus') || label.includes('hiace') || label.includes('transit')) {
    return VEHICLE_3D_ASSETS.van;
  }
  if (cat.includes('pickup') || cat.includes('lorry') || cat.includes('truck') || label.includes('truck') || label.includes('freight') || label.includes('haul')) {
    return VEHICLE_3D_ASSETS.truck;
  }

  return VEHICLE_3D_ASSETS.car;
}
