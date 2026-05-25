import React, { useState, useEffect } from 'react';
import PlanTypeImp from '@interfaces/plans/PlanTypeImp';
import CouponResponseImp from '@interfaces/serviceResponses/CouponResponseImp';

import LicenseServices from '@services/LicenseServices';

interface IProps {
  frequencyId: string;
  usersQuantity: number;
  selectedPlan: PlanTypeImp | undefined;
  planPrice: number;
  setStepTwoData: Function;
  setDiscountCode: Function;
}

const AsideInfo = ({ frequencyId, usersQuantity, selectedPlan, planPrice, setDiscountCode }: IProps): JSX.Element => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [voucher, setVoucher] = useState('');
  const [subTotal, setSubtotal] = useState(planPrice * usersQuantity);
  const [grandTotal, setGrandTotal] = useState(subTotal - discount);
  const [couponList, setCouponList] = useState<CouponResponseImp[]>([]);

  useEffect(() => {
    const subTotal = planPrice * usersQuantity;
    const grandTotal = Math.sign(subTotal - discount) !== 1 ? 0 : subTotal - discount;
    setSubtotal(subTotal);
    setGrandTotal(grandTotal);
  }, [selectedPlan, frequencyId, planPrice, usersQuantity, discount]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const localCoupons = await new LicenseServices().listCoupons();
      setCouponList(localCoupons.results);
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    const vouchers = couponList.map(coupon => coupon.voucher);
    const found = vouchers.findIndex(_voucher => _voucher === voucher);
    if (found !== -1) {
      const foundVoucher = couponList[found];
      if (foundVoucher.isPercentage) {
        setDiscount((parseFloat(foundVoucher.value) / 100) * subTotal);
      } else {
        setDiscount(parseFloat(foundVoucher.value));
      }
      setDiscountCode(voucher);
    }
  }, [voucher, subTotal]);

  const toggleCollapse = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCollapseOpen(!collapseOpen);
  };

  const verifyDiscount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVoucher(e.target.value);
  };

  return (
    <aside>
      <section>
        <header>
          <h2>Resumo da compra</h2>
        </header>

        <div>
          <div>
            {selectedPlan ? (
              <div>
                <h2>
                  {selectedPlan.description} <span />
                </h2>
                <p>R$ {subTotal.toFixed(2).replace(',', '').replace('.', ',')}</p>
                <p>
                  x{usersQuantity} Licença{usersQuantity > 1 && `s`}
                </p>
                {subTotal > 0 ? (
                  <p>
                    Renovado automaticamente após 1{' '}
                    {frequencyId === 'fd5fa871-071f-4e0d-97b6-8fab4a439ee5' ? 'mês' : 'ano'}
                  </p>
                ) : (
                  ''
                )}
              </div>
            ) : (
              <p>Nenhum item foi adicionado até o momento</p>
            )}
          </div>

          <div>
            <div>
              <a href="#collapse-discount" onClick={toggleCollapse}>
                Tem cupom de desconto?
                <span>
                  <span className={`arrown-icon ${collapseOpen ? 'arrow-up' : 'arrow-down'}`} />
                </span>
              </a>
              <div className={`collapse-content ${collapseOpen ? 'open' : ''}`} id="collapse-discount">
                <input name="discount" onChange={verifyDiscount} />
              </div>
            </div>
          </div>

          <div>
            <div>
              <span>Subtotal</span>
              <span>R$ {subTotal.toFixed(2).replace(',', '').replace('.', ',')}</span>
            </div>
            {discount > 0 && (
              <div>
                <span>Desconto</span>
                <span>R$ -{discount.toFixed(2).replace(',', '').replace('.', ',')}</span>
              </div>
            )}
            <div>
              <span>Total</span>
              <span>R$ {grandTotal.toFixed(2).replace(',', '').replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default AsideInfo;
