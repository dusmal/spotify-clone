import React from 'react';
import { useEffect, useState } from 'react';
import { getSeveralCategories } from '../../api/spotifyApiClient';
import style from '../../assets/styles/browseCategories.module.scss';
import {Categories} from '../../types/types';


type Props = {
    onCategorySelect: (onCategorySelect: string) => void;
};

const BrowseCategories = ({onCategorySelect}: Props) => {
    const [categories, setCategories] = useState<Categories|null>(null);

    useEffect(()=>{
        const getAllCategories = async ()=>{
            const spotifyCategories = await getSeveralCategories();
            setCategories(spotifyCategories);
          }
        getAllCategories();
    }, [])

    return (
      <div className={style.browseCategoriesContainer}>
        <div className={style.wrapper}>
            <h4 className={style.header}>Browse...</h4>
            {
                categories && categories.map(el=>{
                    return <div className={style.imageContainer} key={el.id} onClick={()=>onCategorySelect(el.id)}>
                        <img src={el.icons[0].url} /> 
                        <div><p>{el.name}</p></div>
                    </div>
                })
            }  
        </div>      
      </div>
    );
  };
export default BrowseCategories;