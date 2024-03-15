import styles from './index.less';
import {getAuthority} from '../../common/authority'
const Provice = () => {
    return (
        <div className={styles.wrapperProvice}>
            Provice
            <div onClick={() => {
                console.log(getAuthority())
            }}>abc</div>
        </div>
    )
}
export default Provice;